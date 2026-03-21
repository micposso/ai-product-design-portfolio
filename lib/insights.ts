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
  publishedAt: string;
  readTime: string;
  prompt: string;
  sections: Array<InsightSection>;
  markdown: string;
};

function normalizeContent(content: string) {
  return content.replace(/^---$/gm, "").replace(/\r\n/g, "\n").trim();
}

function parseMetadata(markdown: string) {
  const lines = markdown.split("\n");
  const metadata = {
    category: "",
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
    publishedAt: metadata.publishedAt,
    readTime: metadata.readTime,
    prompt: metadata.prompt,
    sections,
    markdown: normalizedMarkdown,
  };
}

function loadInsightPosts() {
  const insightsDirectory = path.join(process.cwd(), "content", "insights");

  return readdirSync(insightsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const insightPath = path.join(insightsDirectory, filename);
      const markdown = readFileSync(insightPath, "utf8");

      return parseInsightPost(markdown, slug);
    });
}

export const insightPosts: Array<InsightPost> = loadInsightPosts();

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}
