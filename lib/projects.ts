import { readdirSync, readFileSync } from "fs";
import path from "path";

export type ProjectSection = {
  title: string;
  content: string;
};

export type ProjectDocument = {
  title: string;
  slug: string;
  summary: string;
  sections: Array<ProjectSection>;
  markdown: string;
};

function normalizeSectionContent(content: string) {
  return content
    .replace(/^---$/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function parseProjectDocument(markdown: string, slug: string): ProjectDocument {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").trim();
  const headingMatches = Array.from(
    normalizedMarkdown.matchAll(/^# (.+)$/gm),
  );

  const title = headingMatches[0]?.[1]?.trim() ?? slug;
  const sectionMatches = Array.from(
    normalizedMarkdown.matchAll(/^## (.+)$/gm),
  );

  const sections = sectionMatches.map((match, index) => {
    const sectionTitle = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = sectionMatches[index + 1]?.index ?? normalizedMarkdown.length;

    return {
      title: sectionTitle,
      content: normalizeSectionContent(normalizedMarkdown.slice(start, end)),
    };
  });

  const summarySection = sections.find((section) => section.title === "Summary");

  return {
    title,
    slug,
    summary: summarySection?.content ?? "",
    sections,
    markdown: normalizedMarkdown,
  };
}

function loadProjectDocuments() {
  const projectsDirectory = path.join(process.cwd(), "content", "projects");

  return readdirSync(projectsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const projectPath = path.join(projectsDirectory, filename);
      const markdown = readFileSync(projectPath, "utf8");

      return parseProjectDocument(markdown, slug);
    });
}

export const projectDocuments = loadProjectDocuments();
