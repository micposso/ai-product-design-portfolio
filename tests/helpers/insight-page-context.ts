import { buildInsightContextDocument, getInsightBySlug } from "@/lib/insights";
import { PageContext } from "@/lib/rag";

export function getInsightPageContext(slug: string): PageContext {
  const post = getInsightBySlug(slug);

  if (!post) {
    throw new Error(`Unknown insight slug: ${slug}`);
  }

  return {
    type: "insight",
    slug: post.slug,
    title: post.title,
    documentText: buildInsightContextDocument(post),
  };
}
