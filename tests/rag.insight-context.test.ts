import { describe, expect, it } from "vitest";

import {
  classifyQueryIntent,
  retrieveRelevantChunks,
  shouldAnswerFromProfile,
} from "@/lib/rag";

import { getInsightPageContext } from "./helpers/insight-page-context";

describe("insight page-context evals", () => {
  it("answers a generic current-post prompt using the active insight page", () => {
    const query = "Summarize the core argument of this post.";
    const pageContext = getInsightPageContext(
      "what-travel-reveals-about-reliable-agentic-systems",
    );
    const retrievedChunks = retrieveRelevantChunks(query, 5, pageContext);
    const intent = classifyQueryIntent(query, retrievedChunks, pageContext);

    expect(retrievedChunks[0]?.chunk.slug).toBe(pageContext.slug);
    expect(retrievedChunks[0]?.chunk.title).toBe(pageContext.title);
    expect(intent.mode).toBe("answer");
    expect(
      shouldAnswerFromProfile(query, retrievedChunks, pageContext),
    ).toBe(true);
  });

  it("prioritizes the current insight for article-specific starter prompts", () => {
    const query = "What role does the voice-based agent play in this post when APIs and search are unreliable?";
    const pageContext = getInsightPageContext(
      "what-travel-reveals-about-reliable-agentic-systems",
    );
    const retrievedChunks = retrieveRelevantChunks(query, 5, pageContext);
    const intent = classifyQueryIntent(query, retrievedChunks, pageContext);

    expect(retrievedChunks[0]?.chunk.slug).toBe(pageContext.slug);
    expect(retrievedChunks[0]?.chunk.title).toBe(pageContext.title);
    expect(intent.mode).toBe("answer");
  });

  it("does not treat the same generic prompt as answerable without insight page context", () => {
    const query = "Summarize the core argument of this post.";
    const retrievedChunks = retrieveRelevantChunks(query, 5);
    const intent = classifyQueryIntent(query, retrievedChunks);

    expect(intent.mode).not.toBe("answer");
  });
});
