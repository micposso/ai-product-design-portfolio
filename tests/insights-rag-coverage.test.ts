import { describe, expect, it } from "vitest";

import {
  getInsightSuggestedActions,
  insightPosts,
} from "@/lib/insights";
import {
  classifyQueryIntent,
  retrieveRelevantChunks,
  shouldAnswerFromProfile,
} from "@/lib/rag";

import { getInsightPageContext } from "./helpers/insight-page-context";

describe("insight RAG coverage", () => {
  it("answers current-post prompts correctly for every insight page", () => {
    for (const post of insightPosts) {
      const query = "Summarize the core argument of this post.";
      const pageContext = getInsightPageContext(post.slug);
      const retrievedChunks = retrieveRelevantChunks(query, 5, pageContext);
      const intent = classifyQueryIntent(query, retrievedChunks, pageContext);

      expect(retrievedChunks[0]?.chunk.slug).toBe(post.slug);
      expect(retrievedChunks[0]?.chunk.title).toBe(post.title);
      expect(intent.mode).toBe("answer");
      expect(
        shouldAnswerFromProfile(query, retrievedChunks, pageContext),
      ).toBe(true);
    }
  });

  it("provides four insight starter prompts for every post", () => {
    for (const post of insightPosts) {
      const actions = getInsightSuggestedActions(post);

      expect(actions).toHaveLength(4);
      expect(actions.every((action) => action.action.length > 0)).toBe(true);
    }
  });

  it("keeps travel-specific quick prompts scoped to the travel post only", () => {
    const travelPost = insightPosts.find(
      (post) => post.slug === "what-travel-reveals-about-reliable-agentic-systems",
    );
    const nonTravelPosts = insightPosts.filter(
      (post) => post.slug !== "what-travel-reveals-about-reliable-agentic-systems",
    );

    expect(travelPost).toBeDefined();
    expect(
      getInsightSuggestedActions(travelPost!).some((action) =>
        action.action.includes("voice-based agent"),
      ),
    ).toBe(true);

    for (const post of nonTravelPosts) {
      expect(
        getInsightSuggestedActions(post).some((action) =>
          action.action.includes("voice-based agent"),
        ),
      ).toBe(false);
    }
  });
});
