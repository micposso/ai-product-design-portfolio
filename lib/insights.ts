import { readdirSync, readFileSync } from "fs";
import path from "path";

export type InsightSection = {
  title: string;
  content: string;
};

export type InsightPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  imageNote?: string;
  publishedAt: string;
  readTime: string;
  prompt: string;
  sections: Array<InsightSection>;
  markdown: string;
};

export type InsightSuggestedAction = {
  title: string;
  label: string;
  action: string;
};

export function buildInsightContextDocument(post: InsightPost) {
  return [
    post.title,
    `Category: ${post.category}`,
    post.image ? `Image: ${post.image}` : "",
    post.imageNote ? `Image Note: ${post.imageNote}` : "",
    `Published At: ${post.publishedAt}`,
    `Read Time: ${post.readTime}`,
    `Excerpt: ${post.excerpt}`,
    ...post.sections.map(
      (section) => `${section.title}\n${section.content}`,
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function getInsightSuggestedActions(
  post: InsightPost,
): Array<InsightSuggestedAction> {
  if (post.slug === "what-travel-reveals-about-reliable-agentic-systems") {
    return [
      {
        title: "Summarize the",
        label: "core argument of this post",
        action: "Summarize the core argument of this post.",
      },
      {
        title: "Why is travel",
        label: "a useful test for agentic systems?",
        action: "Why is travel a useful real-world test for agentic systems in this post?",
      },
      {
        title: "How does the",
        label: "multi-agent system actually work?",
        action: "How does the multi-agent travel system in this post actually work?",
      },
      {
        title: "What role does",
        label: "voice play when APIs fail?",
        action: "What role does the voice-based agent play in this post when APIs and search are unreliable?",
      },
    ];
  }

  return [
    {
      title: "Summarize the",
      label: "core argument of this post",
      action: "Summarize the core argument of this post.",
    },
    {
      title: "What product",
      label: "decisions are behind this post?",
      action: "What product decisions are behind this post?",
    },
    {
      title: "How would you",
      label: "apply these ideas in practice?",
      action: "How would you apply the ideas in this post to a real product team?",
    },
    {
      title: "What should I",
      label: "take away from this as a builder?",
      action: "What should I take away from this post as a product builder?",
    },
  ];
}

function normalizeContent(content: string) {
  return content.replace(/^---$/gm, "").replace(/\r\n/g, "\n").trim();
}

function parseMetadata(markdown: string) {
  const lines = markdown.split("\n");
  const metadata = {
    category: "",
    image: "",
    imageNote: "",
    publishedAt: "",
    readTime: "",
    prompt: "",
  };

  let cursor = 1;

  while (cursor < lines.length) {
    const line = lines[cursor]?.trim() ?? "";

    if (!line) {
      cursor += 1;
      break;
    }

    if (line.startsWith("Category:")) {
      metadata.category = line.replace("Category:", "").trim();
    } else if (line.startsWith("Image:")) {
      metadata.image = line.replace("Image:", "").trim();
    } else if (line.startsWith("Image Note:")) {
      metadata.imageNote = line.replace("Image Note:", "").trim();
    } else if (line.startsWith("Published At:")) {
      metadata.publishedAt = line.replace("Published At:", "").trim();
    } else if (line.startsWith("Read Time:")) {
      metadata.readTime = line.replace("Read Time:", "").trim();
    } else if (line.startsWith("Prompt:")) {
      metadata.prompt = line.replace("Prompt:", "").trim();
    }

    cursor += 1;
  }

  return { metadata, body: lines.slice(cursor).join("\n") };
}

function parseInsightPost(markdown: string, slug: string): InsightPost {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").trim();
  const titleMatch = normalizedMarkdown.match(/^# (.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? slug;
  const { metadata, body } = parseMetadata(normalizedMarkdown);
  const sectionMatches = Array.from(body.matchAll(/^## (.+)$/gm));

  const sections = sectionMatches.map((match, index) => {
    const sectionTitle = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = sectionMatches[index + 1]?.index ?? body.length;

    return {
      title: sectionTitle,
      content: normalizeContent(body.slice(start, end)),
    };
  });

  const excerptSection = sections.find((section) => section.title === "Excerpt");

  return {
    slug,
    category: metadata.category,
    title,
    excerpt: excerptSection?.content ?? "",
    image: metadata.image || undefined,
    imageNote: metadata.imageNote || undefined,
    publishedAt: metadata.publishedAt,
    readTime: metadata.readTime,
    prompt: metadata.prompt,
    sections,
    markdown: normalizedMarkdown,
  };
}

function getPublishedAtTimestamp(post: InsightPost) {
  const timestamp = Date.parse(post.publishedAt);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function loadInsightPosts() {
  const insightsDirectory = path.join(process.cwd(), "content", "insights");

  return readdirSync(insightsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const insightPath = path.join(insightsDirectory, filename);
      const markdown = readFileSync(insightPath, "utf8");

      return parseInsightPost(markdown, slug);
    })
    .sort((a, b) => getPublishedAtTimestamp(b) - getPublishedAtTimestamp(a));
}

export const insightPosts: Array<InsightPost> = loadInsightPosts();

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}
