import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCaseStudyPageContext } from "./helpers/case-study-page-context";

const streamTextMock = vi.fn((options: { system: string }) => ({
  toDataStreamResponse: () =>
    new Response(JSON.stringify({ system: options.system }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }),
}));

vi.mock("ai", () => ({
  convertToCoreMessages: (messages: Array<unknown>) => messages,
  streamText: streamTextMock,
}));

vi.mock("@/ai", () => ({
  geminiFlashModel: { id: "flash" },
  geminiProModel: { id: "pro" },
}));

vi.mock("@/lib/telemetry", () => ({
  withSpan: async <T>(
    _name: string,
    _attributes: Record<string, string | number | boolean | undefined>,
    fn: () => Promise<T> | T,
  ) => await fn(),
}));

function buildRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat case study evals", () => {
  beforeEach(() => {
    streamTextMock.mockClear();
  });

  it("uses the answer path for a generic prompt on a case study page", async () => {
    const { POST } = await import("@/app/(chat)/api/chat/route");
    const pageContext = getCaseStudyPageContext("agentsonly");
    const response = await POST(
      buildRequest({
        id: "chat-answer-path",
        messages: [
          {
            id: "message-1",
            role: "user",
            content: "What tradeoffs did you have to make?",
          },
        ],
        pageContext,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    expect(payload.system).toContain(
      'Start the response with this exact metadata line',
    );
    expect(payload.system).toContain("AgentsOnly");
  });

  it("avoids the answer path for the same generic prompt without page context", async () => {
    const { POST } = await import("@/app/(chat)/api/chat/route");
    const response = await POST(
      buildRequest({
        id: "chat-non-answer-path",
        messages: [
          {
            id: "message-1",
            role: "user",
            content: "What tradeoffs did you have to make?",
          },
        ],
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    expect(payload.system).not.toContain(
      'Start the response with this exact metadata line',
    );
  });
});
