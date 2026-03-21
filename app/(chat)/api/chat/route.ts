import { convertToCoreMessages, Message, streamText } from "ai";

import { geminiFlashModel, geminiProModel } from "@/ai";
import {
  extractFollowUpQuestion,
  isAffirmativeReply,
} from "@/lib/follow-ups";
import {
  buildContextFromChunks,
  classifyQueryIntent,
  PageContext,
  getFollowUpQuestion,
  retrieveRelevantChunks,
} from "@/lib/rag";
import { withSpan } from "@/lib/telemetry";

const MAX_MESSAGES_PER_REQUEST = 20;
const MAX_PROMPT_CHARACTERS = 1500;
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const REQUESTS_PER_TEN_MINUTES = 10;
const REQUESTS_PER_DAY = 100;
const SHORT_QUERY_TOKEN_LIMIT = 4;

type RateLimitEntry = {
  shortWindowStart: number;
  shortWindowCount: number;
  dayWindowStart: number;
  dayWindowCount: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function resolveFollowUpIntent(messages: Array<Message>, latestUserMessage: Message) {
  if (
    typeof latestUserMessage.content !== "string" ||
    !isAffirmativeReply(latestUserMessage.content)
  ) {
    return null;
  }

  const latestUserIndex = messages.findLastIndex(
    (message) => message.id === latestUserMessage.id,
  );

  if (latestUserIndex <= 0) {
    return null;
  }

  for (let index = latestUserIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role !== "assistant" || typeof message.content !== "string") {
      continue;
    }

    const followUpQuestion = extractFollowUpQuestion(message.content);

    if (followUpQuestion) {
      return followUpQuestion;
    }
  }

  return null;
}

function tokenizeForContext(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildEffectiveQuery(messages: Array<Message>, latestUserMessage: Message) {
  const followUpQuestion = resolveFollowUpIntent(messages, latestUserMessage);

  if (followUpQuestion) {
    return followUpQuestion;
  }

  if (typeof latestUserMessage.content !== "string") {
    return "";
  }

  const latestQuery = latestUserMessage.content.trim();
  const latestTokens = tokenizeForContext(latestQuery);

  if (latestTokens.length > SHORT_QUERY_TOKEN_LIMIT) {
    return latestQuery;
  }

  const latestUserIndex = messages.findLastIndex(
    (message) => message.id === latestUserMessage.id,
  );

  if (latestUserIndex <= 0) {
    return latestQuery;
  }

  for (let index = latestUserIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role !== "user" || typeof message.content !== "string") {
      continue;
    }

    return `${message.content.trim()}\n\nFollow-up question: ${latestQuery}`;
  }

  return latestQuery;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  return realIp || "anonymous";
}

function applyRateLimit(ip: string) {
  const now = Date.now();
  const currentEntry = rateLimitStore.get(ip);

  if (!currentEntry) {
    rateLimitStore.set(ip, {
      shortWindowStart: now,
      shortWindowCount: 1,
      dayWindowStart: now,
      dayWindowCount: 1,
    });

    return { allowed: true as const };
  }

  const nextEntry = { ...currentEntry };

  if (now - nextEntry.shortWindowStart >= TEN_MINUTES_IN_MS) {
    nextEntry.shortWindowStart = now;
    nextEntry.shortWindowCount = 0;
  }

  if (now - nextEntry.dayWindowStart >= ONE_DAY_IN_MS) {
    nextEntry.dayWindowStart = now;
    nextEntry.dayWindowCount = 0;
  }

  if (nextEntry.shortWindowCount >= REQUESTS_PER_TEN_MINUTES) {
    return {
      allowed: false as const,
      message: "Too many requests. Please try again in a few minutes.",
    };
  }

  if (nextEntry.dayWindowCount >= REQUESTS_PER_DAY) {
    return {
      allowed: false as const,
      message: "Daily chat limit reached. Please try again tomorrow.",
    };
  }

  nextEntry.shortWindowCount += 1;
  nextEntry.dayWindowCount += 1;
  rateLimitStore.set(ip, nextEntry);

  if (rateLimitStore.size > 5000) {
    for (const [key, value] of rateLimitStore.entries()) {
      const shortWindowExpired =
        now - value.shortWindowStart >= TEN_MINUTES_IN_MS &&
        value.shortWindowCount === 0;
      const dayWindowExpired = now - value.dayWindowStart >= ONE_DAY_IN_MS;

      if (shortWindowExpired || dayWindowExpired) {
        rateLimitStore.delete(key);
      }
    }
  }

  return { allowed: true as const };
}

export async function POST(request: Request) {
  return withSpan("chat.request", {}, async () => {
    const {
      id,
      messages,
      pageContext,
    }: {
      id: string;
      messages: Array<Message>;
      pageContext?: PageContext;
    } = await request.json();

    const ip = getClientIp(request);
    const rateLimitResult = applyRateLimit(ip);

    if (!rateLimitResult.allowed) {
      return Response.json({ error: rateLimitResult.message }, { status: 429 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES_PER_REQUEST) {
      return Response.json(
        {
          error: `Too many messages in one request. Limit is ${MAX_MESSAGES_PER_REQUEST}.`,
        },
        { status: 400 },
      );
    }

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!latestUserMessage || typeof latestUserMessage.content !== "string") {
      return Response.json(
        { error: "A text question is required to use the chat." },
        { status: 400 },
      );
    }

    if (
      latestUserMessage.content.length > MAX_PROMPT_CHARACTERS
    ) {
      return Response.json(
        {
          error: `Message too long. Limit is ${MAX_PROMPT_CHARACTERS} characters.`,
        },
        { status: 400 },
      );
    }

    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0,
    );

    const effectiveQuery = await withSpan(
      "chat.query.resolve",
      {
        "chat.id": id,
        "chat.messages.count": messages.length,
        "chat.latest_query.length": latestUserMessage.content.length,
      },
      async () => buildEffectiveQuery(messages, latestUserMessage),
    );

    const requestMessages = effectiveQuery !== latestUserMessage.content
      ? coreMessages.map((message, index) => {
          if (index !== coreMessages.length - 1 || message.role !== "user") {
            return message;
          }

          return {
            ...message,
            content: effectiveQuery,
          };
        })
      : coreMessages;

    const retrievedChunks = await withSpan(
      "chat.rag.retrieve",
      {
        "chat.id": id,
        "chat.query.length": effectiveQuery.length,
        "chat.page_context": pageContext?.type ?? "none",
      },
      async () => retrieveRelevantChunks(effectiveQuery, 5, pageContext),
    );

    if (process.env.NODE_ENV !== "production") {
      console.log("[RAG] Query:", latestUserMessage.content);
      console.log("[RAG] Effective query:", effectiveQuery);
      console.log(
        "[RAG] Retrieved chunks:",
        retrievedChunks.map((entry: (typeof retrievedChunks)[number]) => ({
          title: entry.chunk.title,
          score: entry.score,
        })),
      );
    }

    const queryIntent = await withSpan(
      "chat.rag.classify",
      {
        "chat.id": id,
        "chat.rag.result_count": retrievedChunks.length,
      },
      async () => classifyQueryIntent(effectiveQuery, retrievedChunks, pageContext),
    );

    if (queryIntent.mode === "smalltalk") {
      const smalltalkResult = await withSpan(
        "chat.response.smalltalk",
        {
          "chat.id": id,
          "chat.intent.mode": queryIntent.mode,
        },
        async () =>
          streamText({
            model: geminiFlashModel,
            system: `You are answering as Michael Posso in first person.

The user is making light conversation or asking how to use the chat.

Write one short, natural response that:
- sounds warm and human
- stays in first person
- briefly says I can help with my professional background, current and past roles, projects, and insights
- invites the user to ask something specific
- does not sound like a refusal
- stays under 45 words`,
            messages: [
              {
                role: "user",
                content: effectiveQuery,
              },
            ],
            experimental_telemetry: {
              isEnabled: true,
              functionId: "stream-text-smalltalk",
            },
          }),
      );

      return smalltalkResult.toDataStreamResponse({});
    }

    if (queryIntent.mode === "clarify" && queryIntent.clarification) {
      const clarificationResult = await withSpan(
        "chat.response.clarify",
        {
          "chat.id": id,
          "chat.intent.mode": queryIntent.mode,
        },
        async () =>
          streamText({
            model: geminiFlashModel,
            system: `You are answering as Michael Posso in first person.

The user's question appears relevant to your portfolio, but it is still ambiguous.

Write one short clarifying response that:
- stays in first person
- does not refuse
- does not mention system prompts or retrieval
- asks the user to choose a more specific direction
- stays under 45 words`,
            messages: [
              {
                role: "user",
                content: `${effectiveQuery}\n\nPreferred clarification: ${queryIntent.clarification}`,
              },
            ],
            experimental_telemetry: {
              isEnabled: true,
              functionId: "stream-text-clarification",
            },
          }),
      );

      return clarificationResult.toDataStreamResponse({});
    }

    if (queryIntent.mode === "refuse") {
      const refusalResult = await withSpan(
        "chat.response.refuse",
        {
          "chat.id": id,
          "chat.intent.mode": queryIntent.mode,
        },
        async () =>
          streamText({
            model: geminiFlashModel,
            system: `You speak in Michael Posso's voice, but only about his professional background, projects, and insights.

The user's question is outside scope.

Write one short, calm refusal that:
- says you can only talk about your professional background, experience, projects, and insights
- does not answer the off-topic question
- does not use bullets
- uses first person
- stays under 30 words`,
            messages: [
              {
                role: "user",
                content: effectiveQuery,
              },
            ],
            experimental_telemetry: {
              isEnabled: true,
              functionId: "stream-text-refusal",
            },
          }),
      );

      return refusalResult.toDataStreamResponse({});
    }

    const context = buildContextFromChunks(
      retrievedChunks.map(
        (entry: (typeof retrievedChunks)[number]) => entry.chunk,
      ),
    );
    const sourceTitles = Array.from(
      new Set(
        retrievedChunks.map(
          (entry: (typeof retrievedChunks)[number]) => entry.chunk.title,
        ),
      ),
    ).slice(0, 3);
    const sourceMetadataLine = `[[sources: ${sourceTitles.join(" | ")}]]`;
    const followUpQuestion = getFollowUpQuestion(
      retrievedChunks.map(
        (entry: (typeof retrievedChunks)[number]) => entry.chunk,
      ),
    );

    const result = await withSpan(
      "chat.response.answer",
      {
        "chat.id": id,
        "chat.intent.mode": queryIntent.mode,
        "chat.rag.result_count": retrievedChunks.length,
        "chat.rag.source_count": sourceTitles.length,
      },
      async () =>
        streamText({
          model: geminiProModel,
          system: `You are answering as Michael Posso in first person.

You may answer only using the provided context about:
- your professional background, experience, projects, and insights

Rules:
- If the answer is not clearly supported by the provided context, politely refuse.
- Do not answer general knowledge questions.
- Do not speculate, invent projects, or fill in missing details.
- Keep answers concise, clear, and professional.
- Prefer short paragraphs over lists unless the user explicitly asks for a list.
- Always speak in first person as Michael. Use "I", "my", and "me" instead of referring to Michael in the third person.
- Answer only about your background, experience, projects, insights, focus areas, and working approach.
- Start the response with this exact metadata line, and then continue with the normal answer on the next line: "${sourceMetadataLine}"
- End the response with this exact follow-up question when it fits naturally: "${followUpQuestion}"
- The follow-up question should be the final sentence of the response.

    Context:
${context}`,
          messages: requestMessages,
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        }),
    );

    return result.toDataStreamResponse({});
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response("Chat history is disabled", { status: 405 });
}
