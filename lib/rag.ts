import { FollowUpQuestion } from "./follow-ups";
import { profileDocument } from "./profile";

type SourceType = "profile";

export type KnowledgeChunk = {
  id: string;
  sourceType: SourceType;
  title: string;
  slug?: string;
  text: string;
};

const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "built",
  "do",
  "for",
  "from",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "lately",
  "me",
  "my",
  "of",
  "on",
  "or",
  "tell",
  "that",
  "the",
  "to",
  "what",
  "with",
  "you",
  "your",
]);

const PROFILE_SCOPE_TERMS = [
  "michael",
  "posso",
  "experience",
  "background",
  "role",
  "work",
  "worked",
  "job",
  "jobs",
  "history",
  "last",
  "latest",
  "current",
  "now",
  "before",
  "previous",
  "employer",
  "employers",
  "career",
  "professional",
  "focus",
  "skills",
  "approach",
  "product",
  "design",
  "engineering",
  "frontend",
  "teaching",
  "teach",
  "teacher",
  "professor",
  "professorship",
  "university",
  "nyit",
  "fit",
  "ux",
  "ui",
  "ai",
  "assistant",
  "assistants",
  "agent",
  "workflow",
  "workflows",
  "launch",
  "prototype",
  "shipping",
];

function stripMarkdown(text: string) {
  return text
    .replace(/^#+\s+/gm, "")
    .replace(/^\-\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function buildExperienceSummary() {
  if (profileDocument.experienceEntries.length === 0) {
    return "";
  }

  const currentRole = profileDocument.experienceEntries[0];
  const previousRoles = profileDocument.experienceEntries
    .slice(1)
    .map((entry) => `${entry.company} (${entry.role})`)
    .join(", ");

  return [
    currentRole
      ? `Current role: ${currentRole.role} at ${currentRole.company}.`
      : "",
    previousRoles ? `Previous roles include ${previousRoles}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildJobHistorySummary() {
  if (profileDocument.experienceEntries.length === 0) {
    return "";
  }

  const [currentRole, ...previousRoles] = profileDocument.experienceEntries;
  const lines: string[] = [];

  if (currentRole) {
    lines.push(
      `I currently work at ${currentRole.company} as ${currentRole.role}.`,
    );
  }

  previousRoles.forEach((entry, index) => {
    const prefix = index === 0 ? "Before that" : "Earlier";
    lines.push(`${prefix}, I worked at ${entry.company} as ${entry.role}.`);
  });

  return lines.join(" ");
}

function buildTeachingSummary() {
  const teachingEntries = profileDocument.experienceEntries.filter((entry) =>
    /professor|teach/i.test(`${entry.role} ${entry.description} ${entry.content}`),
  );

  if (teachingEntries.length === 0) {
    return "";
  }

  return teachingEntries
    .map(
      (entry) =>
        `${entry.company}: ${entry.role}. ${entry.description} ${stripMarkdown(entry.content)}`,
    )
    .join(" ");
}

function normalizeText(text: string) {
  return text.toLowerCase();
}

function tokenize(text: string) {
  return normalizeText(text)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function uniqueTokens(text: string) {
  return new Set(tokenize(text));
}

const profileChunks: Array<KnowledgeChunk> = [
  {
    id: "profile-intro",
    sourceType: "profile",
    title: `${profileDocument.name} Intro`,
    text: stripMarkdown(profileDocument.intro),
  },
  ...profileDocument.sections
    .filter((section) => section.content.length > 0)
    .map((section) => ({
      id: `profile-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      sourceType: "profile" as const,
      title: section.title,
      text: stripMarkdown(section.content),
    })),
  {
    id: "profile-current-role",
    sourceType: "profile",
    title: "Current Role",
    text: buildExperienceSummary(),
  },
  {
    id: "profile-job-history",
    sourceType: "profile",
    title: "Job History",
    text: buildJobHistorySummary(),
  },
  {
    id: "profile-teaching-experience",
    sourceType: "profile",
    title: "Teaching Experience",
    text: buildTeachingSummary(),
  },
  ...profileDocument.experienceEntries.map((entry, index) => ({
    id: `profile-experience-entry-${index + 1}`,
    sourceType: "profile" as const,
    title: entry.company,
    text: stripMarkdown(
      `${entry.company}\n${entry.role}\n${entry.dates}\n${entry.location}\n${entry.description}\n${entry.content}`,
    ),
  })),
];

export const portfolioKnowledgeBase: Array<KnowledgeChunk> = [...profileChunks];

function scoreScope(query: string) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = Array.from(uniqueTokens(query));
  let score = 0;

  for (const token of PROFILE_SCOPE_TERMS) {
    if (normalizedQuery.includes(token) || queryTokens.includes(token)) {
      score += 1;
    }
  }

  if (normalizedQuery.includes("tell me about yourself")) {
    score += 3;
  }

  if (normalizedQuery.includes("professional experience")) {
    score += 3;
  }

  return score;
}

function isJobHistoryQuestion(query: string) {
  const normalizedQuery = normalizeText(query);

  return [
    "last job",
    "last role",
    "latest job",
    "current job",
    "current role",
    "where do you work",
    "where did you work",
    "what was your last job",
    "what is your last job",
    "what was your previous job",
    "what did you do before",
    "where did you work before",
    "who did you work for",
    "previous job",
    "previous role",
    "previous company",
    "past job",
    "job history",
    "work history",
    "teaching experience",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function isTeachingQuestion(query: string) {
  const normalizedQuery = normalizeText(query);

  return [
    "teaching experience",
    "teach",
    "teaching",
    "professor",
    "adjunct",
    "nyit",
    "fit",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function scoreChunk(query: string, chunk: KnowledgeChunk) {
  const queryTokens = Array.from(uniqueTokens(query));

  if (queryTokens.length === 0) {
    return 0;
  }

  const haystack = normalizeText(`${chunk.title} ${chunk.text}`);
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 1;
    }

    if (normalizeText(chunk.title).includes(token)) {
      score += 2;
    }

    if (chunk.slug && normalizeText(chunk.slug).includes(token)) {
      score += 2;
    }
  }

  if (isJobHistoryQuestion(query)) {
    if (
      ["Current Role", "Job History", "Professional Experience"].includes(
        chunk.title,
      )
    ) {
      score += 5;
    }

    if (
      profileDocument.experienceEntries.some((entry) => entry.company === chunk.title)
    ) {
      score += 4;
    }
  }

  if (isTeachingQuestion(query) && chunk.title === "Teaching Experience") {
    score += 6;
  }

  return score;
}

export function retrieveRelevantChunks(query: string, limit = 5) {
  const scored = portfolioKnowledgeBase
    .map((chunk) => ({
      chunk,
      score: scoreChunk(query, chunk),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length > 0) {
    return scored;
  }

  if (isJobHistoryQuestion(query)) {
    return portfolioKnowledgeBase
      .filter((chunk) =>
        ["Current Role", "Job History", "Professional Experience"].includes(
          chunk.title,
        ) ||
        profileDocument.experienceEntries.some(
          (entry) => entry.company === chunk.title,
        ),
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index, 1),
      }));
  }

  if (isTeachingQuestion(query)) {
    return portfolioKnowledgeBase
      .filter((chunk) =>
        ["Teaching Experience", "Professional Experience"].includes(chunk.title),
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index, 1),
      }));
  }

  return scored;
}

export function shouldAnswerFromProfile(
  query: string,
  retrievedChunks: ReturnType<typeof retrieveRelevantChunks>,
) {
  const scopeScore = scoreScope(query);
  const topScore = retrievedChunks[0]?.score ?? 0;
  const totalScore = retrievedChunks.reduce((sum, entry) => sum + entry.score, 0);
  const matchedChunkCount = retrievedChunks.length;

  const hasStrongProfileIntent = scopeScore >= 2;
  const hasStrongRetrieval = topScore >= 3 || totalScore >= 5;
  const hasEnoughSignal = matchedChunkCount >= 2 || totalScore >= 4;
  const hasJobHistoryIntent = isJobHistoryQuestion(query);

  if (hasJobHistoryIntent) {
    return hasStrongRetrieval || hasEnoughSignal;
  }

  return hasStrongProfileIntent && hasStrongRetrieval && hasEnoughSignal;
}

export function buildContextFromChunks(chunks: Array<KnowledgeChunk>) {
  return chunks
    .map((chunk, index) => {
      const sourceLabel = chunk.slug
        ? `${chunk.sourceType}:${chunk.slug}`
        : chunk.sourceType;

      return `[Source ${index + 1}] ${chunk.title} (${sourceLabel})\n${chunk.text}`;
    })
    .join("\n\n");
}

const FOLLOW_UP_LIBRARY: Array<{
  matchTitles: string[];
  question: FollowUpQuestion;
}> = [
  {
    matchTitles: ["Professional Experience"],
    question: "Would you like to learn about my personal projects?",
  },
  {
    matchTitles: ["Core Skills", "Selected Technologies"],
    question: "Would you like me to walk through the tools and technologies I use most often?",
  },
  {
    matchTitles: ["Summary", "Michael Posso Intro"],
    question: "Would you like a quick overview of my current role and focus areas?",
  },
  {
    matchTitles: ["Research Interests"],
    question: "Would you like to hear how those interests connect to the products I build?",
  },
  {
    matchTitles: ["Education", "Languages"],
    question: "Would you like to learn more about the broader background behind my work?",
  },
];

export function getFollowUpQuestion(chunks: Array<KnowledgeChunk>) {
  for (const chunk of chunks) {
    const match = FOLLOW_UP_LIBRARY.find((entry) =>
      entry.matchTitles.includes(chunk.title),
    );

    if (match) {
      return match.question;
    }
  }

  return "Would you like to explore another part of my background?";
}
