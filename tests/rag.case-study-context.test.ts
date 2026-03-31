import { describe, expect, it } from "vitest";

import {
  classifyQueryIntent,
  retrieveRelevantChunks,
  shouldAnswerFromProfile,
} from "@/lib/rag";

import { getCaseStudyPageContext } from "./helpers/case-study-page-context";

describe("case study page-context evals", () => {
  it("answers a generic prefilled prompt using the current case study page", () => {
    const query = "What tradeoffs did you have to make?";
    const pageContext = getCaseStudyPageContext("agentsonly");
    const retrievedChunks = retrieveRelevantChunks(query, 5, pageContext);
    const intent = classifyQueryIntent(query, retrievedChunks, pageContext);

    expect(retrievedChunks[0]?.chunk.slug).toBe("agentsonly");
    expect(retrievedChunks[0]?.chunk.title).toBe(pageContext.title);
    expect(intent.mode).toBe("answer");
    expect(
      shouldAnswerFromProfile(query, retrievedChunks, pageContext),
    ).toBe(true);
  });

  it("switches to the active case study when the same prompt is asked on a different page", () => {
    const query = "What was the core product problem here?";
    const pageContext = getCaseStudyPageContext("clawcast");
    const retrievedChunks = retrieveRelevantChunks(query, 5, pageContext);
    const intent = classifyQueryIntent(query, retrievedChunks, pageContext);

    expect(retrievedChunks[0]?.chunk.slug).toBe("clawcast");
    expect(retrievedChunks[0]?.chunk.title).toBe(pageContext.title);
    expect(intent.mode).toBe("answer");
  });

  it("does not treat the same generic prompt as answerable without page context", () => {
    const query = "What tradeoffs did you have to make?";
    const retrievedChunks = retrieveRelevantChunks(query, 5);
    const intent = classifyQueryIntent(query, retrievedChunks);

    expect(intent.mode).not.toBe("answer");
  });
});
