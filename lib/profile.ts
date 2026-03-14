import { readFileSync } from "fs";
import path from "path";

export type ProfileSection = {
  title: string;
  content: string;
};

export type ProfileDocument = {
  name: string;
  intro: string;
  sections: Array<ProfileSection>;
  experienceEntries: Array<ProfileExperienceEntry>;
  markdown: string;
};

export type ProfileExperienceEntry = {
  company: string;
  role: string;
  dates: string;
  location: string;
  description: string;
  content: string;
};

function normalizeSectionContent(content: string) {
  return content
    .replace(/^---$/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function parseProfileDocument(markdown: string): ProfileDocument {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").trim();
  const headingMatches = Array.from(
    normalizedMarkdown.matchAll(/^# (.+)$/gm),
  );

  const name = headingMatches[0]?.[1]?.trim() ?? "Michael Posso";

  const sections = headingMatches.slice(1).map((match, index) => {
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const nextMatch = headingMatches[index + 2];
    const end = nextMatch?.index ?? normalizedMarkdown.length;
    const content = normalizeSectionContent(
      normalizedMarkdown.slice(start, end),
    );

    return {
      title,
      content,
    };
  });

  const introStart = headingMatches[0]
    ? (headingMatches[0].index ?? 0) + headingMatches[0][0].length
    : 0;
  const introEnd = headingMatches[1]?.index ?? normalizedMarkdown.length;
  const intro = normalizeSectionContent(
    normalizedMarkdown.slice(introStart, introEnd),
  );

  const professionalExperienceSection = sections.find(
    (section) => section.title === "Professional Experience",
  );

  return {
    name,
    intro,
    sections,
    experienceEntries: parseExperienceEntries(
      professionalExperienceSection?.content ?? "",
    ),
    markdown: normalizedMarkdown,
  };
}

function parseExperienceEntries(sectionContent: string): Array<ProfileExperienceEntry> {
  const normalizedSection = sectionContent.replace(/\r\n/g, "\n").trim();

  if (!normalizedSection) {
    return [];
  }

  const companyMatches = Array.from(normalizedSection.matchAll(/^## (.+)$/gm));

  return companyMatches.map((match, index) => {
    const company = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = companyMatches[index + 1]?.index ?? normalizedSection.length;
    const block = normalizedSection.slice(start, end).trim();
    const roleMatch = block.match(/^### (.+)$/m);
    const role = roleMatch?.[1]?.trim() ?? "";
    const remainingBlock = roleMatch
      ? block.slice((roleMatch.index ?? 0) + roleMatch[0].length).trim()
      : block;

    const lines = remainingBlock
      .split("\n")
      .map((line) => line.replace(/\*\*/g, "").trim())
      .filter((line) => line.length > 0 && line !== "---");

    const dates = lines[0] ?? "";
    const location = lines[1] ?? "";
    const description = lines[2] ?? "";

    return {
      company,
      role,
      dates,
      location,
      description,
      content: block,
    };
  });
}

function loadProfileDocument() {
  const profilePath = path.join(process.cwd(), "content", "profile.md");
  const markdown = readFileSync(profilePath, "utf8");

  return parseProfileDocument(markdown);
}

export const profileDocument = loadProfileDocument();
