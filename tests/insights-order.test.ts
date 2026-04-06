import { describe, expect, it } from "vitest";

import { insightPosts } from "@/lib/insights";

describe("insight ordering", () => {
  it("sorts insights by published date with newest first", () => {
    expect(insightPosts[0]?.slug).toBe(
      "what-travel-reveals-about-reliable-agentic-systems",
    );
    expect(insightPosts[0]?.publishedAt).toBe("April 6, 2026");

    const publishedTimestamps = insightPosts.map((post) =>
      Date.parse(post.publishedAt),
    );

    expect(publishedTimestamps).toEqual(
      [...publishedTimestamps].sort((a, b) => b - a),
    );
  });
});
