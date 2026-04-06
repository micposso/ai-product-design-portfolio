import { describe, expect, it } from "vitest";

import { getInsightBySlug } from "@/lib/insights";

describe("insight image metadata", () => {
  it("leaves image undefined for insights without image metadata", () => {
    expect(
      getInsightBySlug("the-expresso-team-hasnt-fully-brewed-yet")?.image,
    ).toBeUndefined();
    expect(
      getInsightBySlug("the-expresso-team-hasnt-fully-brewed-yet")?.imageNote,
    ).toBeUndefined();
  });

  it("supports optional image metadata when present", () => {
    const post = getInsightBySlug(
      "what-travel-reveals-about-reliable-agentic-systems",
    );

    expect(post).toBeDefined();
    expect("image" in post!).toBe(true);
    expect("imageNote" in post!).toBe(true);
  });
});
