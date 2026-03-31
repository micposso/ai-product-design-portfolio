import {
  buildCaseStudyContextDocument,
  getCaseStudyBySlug,
} from "@/lib/case-studies";
import { PageContext } from "@/lib/rag";

export function getCaseStudyPageContext(slug: string): PageContext {
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    throw new Error(`Unknown case study slug: ${slug}`);
  }

  return {
    type: "case-study",
    slug: caseStudy.slug,
    title: caseStudy.title,
    documentText: buildCaseStudyContextDocument(caseStudy),
  };
}
