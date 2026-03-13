export type InsightPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  prompt: string;
};

export const insightPosts: Array<InsightPost> = [
  {
    slug: "building-ai-products-with-clarity",
    category: "Product",
    title: "Building AI products with clarity instead of hype",
    excerpt:
      "Placeholder blog copy about shaping AI products around real workflows, measurable value, and clear product constraints.",
    publishedAt: "March 2026",
    readTime: "5 min read",
    prompt: "What are your thoughts on building AI products with clarity instead of hype?",
  },
  {
    slug: "designing-for-trust-in-ai-interfaces",
    category: "Design Engineering",
    title: "Designing for trust in AI interfaces",
    excerpt:
      "Placeholder blog copy about interaction design, confidence cues, and reducing ambiguity in AI-powered experiences.",
    publishedAt: "March 2026",
    readTime: "6 min read",
    prompt: "How do you think about trust when designing AI interfaces?",
  },
  {
    slug: "shipping-fast-without-looking-rushed",
    category: "Execution",
    title: "Shipping fast without looking rushed",
    excerpt:
      "Placeholder blog copy about balancing velocity with craft, product quality, and a strong delivery rhythm.",
    publishedAt: "March 2026",
    readTime: "4 min read",
    prompt: "How do you ship fast without making the product feel rushed?",
  },
];

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}
