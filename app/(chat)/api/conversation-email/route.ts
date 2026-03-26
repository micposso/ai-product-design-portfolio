import { NextResponse } from "next/server";
import { z } from "zod";

import { stripSourceMetadata } from "@/lib/message-metadata";

const SITE_NAME = "michaelposso.ai";
const SUBJECT = "Conversation with michaelposso.ai";
const INTRO = "Here is a copy of your conversation from michaelposso.ai.";

const ConversationEmailSchema = z.object({
  email: z.string().email(),
  company: z.string().max(0).optional().default(""),
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.unknown(),
      }),
    )
    .min(1)
    .max(50),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeConversation(
  messages: Array<{ role: string; content?: unknown }>,
) {
  return messages
    .map((message) => {
      if (typeof message.content !== "string") {
        return null;
      }

      const content =
        message.role === "assistant"
          ? stripSourceMetadata(message.content).trim()
          : message.content.trim();

      if (!content) {
        return null;
      }

      return {
        speaker: message.role === "assistant" ? "MichaelPosso.ai" : "You",
        content,
      };
    })
    .filter((message): message is { speaker: string; content: string } =>
      Boolean(message),
    );
}

function buildHtmlConversation(
  conversation: Array<{ speaker: string; content: string }>,
) {
  const conversationHtml = conversation
    .map(
      (message) => `
        <div style="margin:0 0 24px;">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#2d6b47;">
            ${escapeHtml(message.speaker)}
          </p>
          <div style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#2f2a26;white-space:pre-wrap;">
            ${escapeHtml(message.content)}
          </div>
        </div>`,
    )
    .join("");

  return `
    <div style="background:#f5efe8;padding:32px 16px;">
      <div style="max-width:720px;margin:0 auto;background:#fffaf5;border:1px solid #d1b8a7;border-radius:20px;padding:32px;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2d6b47;">
          ${SITE_NAME}
        </p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:32px;line-height:1.1;color:#2f2a26;">
          Conversation copy
        </h1>
        <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a433d;">
          ${INTRO}
        </p>
        <hr style="border:none;border-top:1px solid #e4d5c8;margin:0 0 28px;" />
        ${conversationHtml}
      </div>
    </div>
  `;
}

function buildTextConversation(
  conversation: Array<{ speaker: string; content: string }>,
) {
  const body = conversation
    .map((message) => `${message.speaker}\n${message.content}`)
    .join("\n\n");

  return `${SITE_NAME}\n\n${INTRO}\n\n${body}`;
}

function parseEmailAddress(fromAddress: string) {
  const match = fromAddress.match(/<([^>]+)>/);

  return (match?.[1] ?? fromAddress).trim();
}

function parseDomainFromEmailAddress(emailAddress: string) {
  const [, domain = ""] = emailAddress.split("@");

  return domain.toLowerCase();
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const json = await request.json();
    const validated = ConversationEmailSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address and conversation." },
        { status: 400 },
      );
    }

    const conversation = normalizeConversation(validated.data.messages);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "There is no conversation content to email yet." },
        { status: 400 },
      );
    }

    const totalCharacters = conversation.reduce(
      (sum, message) => sum + message.content.length,
      0,
    );

    if (totalCharacters > 30000) {
      return NextResponse.json(
        { error: "This conversation is too long to email in one message." },
        { status: 400 },
      );
    }

    const fromAddress =
      process.env.EMAIL_FROM ?? "Michael Posso <onboarding@resend.dev>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [validated.data.email],
        subject: SUBJECT,
        html: buildHtmlConversation(conversation),
        text: buildTextConversation(conversation),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const senderEmailAddress = parseEmailAddress(fromAddress);
      const senderDomain = parseDomainFromEmailAddress(senderEmailAddress);
      const resendRejectedUnverifiedDomain =
        response.status === 403 &&
        errorBody.toLowerCase().includes("domain is not verified");

      if (resendRejectedUnverifiedDomain) {
        return NextResponse.json(
          {
            error: `The sender domain for EMAIL_FROM (${senderDomain}) is not verified in Resend. Verify that domain in Resend, or temporarily use onboarding@resend.dev as the sender address.`,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { error: `Resend could not send the email. ${errorBody}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to send the conversation email right now." },
      { status: 500 },
    );
  }
}
