import { caseStudies } from "./case-studies";
import { FollowUpQuestion } from "./follow-ups";
import { insightPosts } from "./insights";
import { profileDocument } from "./profile";
import { projectDocuments } from "./projects";

type SourceType = "profile" | "project" | "insight" | "case-study";

export type KnowledgeChunk = {
  id: string;
  sourceType: SourceType;
  title: string;
  slug?: string;
  text: string;
};

export type QueryIntent = {
  mode: "answer" | "clarify" | "refuse" | "smalltalk";
  clarification?: string;
};

export type PageContext = {
  type: "insight" | "case-study";
  slug: string;
  title?: string;
  documentText?: string;
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
  "do",
  "for",
  "from",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
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

const PORTFOLIO_SCOPE_TERMS = [
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
  "agents",
  "workflow",
  "workflows",
  "launch",
  "prototype",
  "shipping",
  "project",
  "projects",
  "build",
  "built",
  "building",
  "working",
  "recent",
  "lately",
  "thesis",
  "reachy",
  "farmers",
  "vision",
  "podcast",
  "case",
  "study",
  "studies",
  "portfolio",
  "trust",
  "insight",
  "insights",
  "blog",
  "blogs",
  "article",
  "articles",
  "wrote",
  "written",
  "writing",
  "thoughts",
  "clarity",
];

function normalizeAlias(text: string) {
  return normalizeText(text)
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectAliasPhrases(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => {
          if (!value) {
            return [];
          }

          const normalizedValue = normalizeAlias(value);

          return normalizedValue ? [normalizedValue] : [];
        })
        .filter((value) => value.length > 2),
    ),
  );
}

function stripMarkdown(text: string) {
  return text
    .replace(/^#+\s+/gm, "")
    .replace(/^\-\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function normalizeText(text: string) {
  return text.toLowerCase();
}

function normalizeCompactText(text: string) {
  return normalizeText(text)
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function buildProjectsSummary() {
  if (projectDocuments.length === 0) {
    return "";
  }

  return projectDocuments
    .map((project) => `${project.title}: ${stripMarkdown(project.summary)}`)
    .join(" ");
}

function buildInsightsSummary() {
  if (insightPosts.length === 0) {
    return "";
  }

  return insightPosts
    .map((post) => `${post.title}: ${stripMarkdown(post.excerpt)}`)
    .join(" ");
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

function isProjectQuestion(query: string) {
  const normalizedQuery = normalizeText(query);

  return [
    "what have you built",
    "built lately",
    "what are you building",
    "working on",
    "recent project",
    "recent projects",
    "projects",
    "project",
    "thesis",
    "reachy",
    "reachy mini",
    "embodied ai",
    "mandarin",
    "robot tutor",
    "language tutor",
    "aixlab",
    "suny poly",
    "farmers",
    "west africa",
    "pests",
    "agentsonly",
    "agentsonly.io",
    "clawcast",
    "green room",
    "interactive pdf",
    "podcast",
    "tts",
    "voice",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function isInsightQuestion(query: string) {
  const normalizedQuery = normalizeText(query);

  return [
    "insight",
    "insights",
    "blog",
    "blogs",
    "article",
    "articles",
    "what have you written",
    "what did you write",
    "wrote lately",
    "thoughts on",
    "point of view",
    "clarity instead of hype",
    "trust in ai interfaces",
    "shipping fast",
    "metaverse",
    "expresso",
    "designing for agents",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function isCaseStudyQuestion(query: string) {
  const normalizedQuery = normalizeText(query);

  return [
    "case study",
    "case studies",
    "portfolio piece",
    "portfolio project",
    "clawcast",
    "green room",
    "interactive pdf",
    "agentsonly",
    "reachy mini",
    "mandarin robot",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function isLikelyPortfolioQuestion(query: string) {
  return (
    isJobHistoryQuestion(query) ||
    isTeachingQuestion(query) ||
    isProjectQuestion(query) ||
    isCaseStudyQuestion(query) ||
    isInsightQuestion(query) ||
    scoreScope(query) >= 2
  );
}

function isGreeting(query: string) {
  const normalizedQuery = normalizeCompactText(query);

  return [
    "hi",
    "hello",
    "hey",
    "hey there",
    "hi there",
    "good morning",
    "good afternoon",
    "good evening",
  ].includes(normalizedQuery);
}

function isHelpPrompt(query: string) {
  const normalizedQuery = normalizeCompactText(query);

  return [
    "help",
    "what can you help with",
    "what can i ask",
    "what can i ask you",
    "what should i ask",
    "what do you know",
    "what can you tell me about",
    "who are you",
    "introduce yourself",
  ].includes(normalizedQuery);
}

function isLightConversation(query: string) {
  const normalizedQuery = normalizeCompactText(query);

  return [
    "thanks",
    "thank you",
    "cool",
    "nice",
    "awesome",
    "great",
    "ok",
    "okay",
    "sounds good",
    "bye",
    "goodbye",
    "see you",
  ].includes(normalizedQuery);
}

function isPageRelativeQuestion(query: string) {
  const normalizedQuery = normalizeCompactText(query);

  return [
    "this post",
    "this article",
    "this insight",
    "this case study",
    "this project",
    "this page",
    "summarize this",
    "summarize this post",
    "what is this post about",
    "what is this article about",
    "what is this about",
    "what are the takeaways here",
    "what are the main takeaways",
    "tell me about this post",
    "tell me about this article",
  ].some((pattern) => normalizedQuery.includes(pattern));
}

function buildPageContextChunk(pageContext?: PageContext): KnowledgeChunk | null {
  if (!pageContext?.documentText?.trim()) {
    return null;
  }

  return {
    id: `page-context-${pageContext.type}-${pageContext.slug}`,
    sourceType: pageContext.type,
    title: pageContext.title || pageContext.slug,
    slug: pageContext.slug,
    text: stripMarkdown(pageContext.documentText),
  };
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
  {
    id: "profile-projects-summary",
    sourceType: "profile",
    title: "Projects Summary",
    text: buildProjectsSummary(),
  },
  {
    id: "profile-insights-summary",
    sourceType: "profile",
    title: "Insights Summary",
    text: buildInsightsSummary(),
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

const projectChunks: Array<KnowledgeChunk> = projectDocuments.flatMap(
  (project, index) => [
    {
      id: `project-${index + 1}`,
      sourceType: "project" as const,
      title: project.title,
      slug: project.slug,
      text: stripMarkdown(project.summary || project.markdown),
    },
    ...project.sections
      .filter((section) => section.content.length > 0)
      .map((section) => ({
        id: `project-${project.slug}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        sourceType: "project" as const,
        title: `${project.title} ${section.title}`,
        slug: project.slug,
        text: stripMarkdown(section.content),
      })),
  ],
);

const insightChunks: Array<KnowledgeChunk> = insightPosts.flatMap((post, index) => [
  {
    id: `insight-${index + 1}`,
    sourceType: "insight" as const,
    title: post.title,
    slug: post.slug,
    text: stripMarkdown(post.excerpt || post.markdown),
  },
  ...post.sections
    .filter((section) => section.content.length > 0)
    .map((section) => ({
      id: `insight-${post.slug}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      sourceType: "insight" as const,
      title: `${post.title} ${section.title}`,
      slug: post.slug,
      text: stripMarkdown(section.content),
    })),
]);

const caseStudyChunks: Array<KnowledgeChunk> = caseStudies.flatMap(
  (caseStudy, index) => [
    {
      id: `case-study-${index + 1}`,
      sourceType: "case-study" as const,
      title: caseStudy.title,
      slug: caseStudy.slug,
      text: stripMarkdown(
        `${caseStudy.eyebrow}\n${caseStudy.subtitle}\n${caseStudy.summary}\n${caseStudy.challenge}\n${caseStudy.outcome}\n${caseStudy.stages
          .map(
            (stage) =>
              `${stage.label} ${stage.title}\n${stage.description}`,
          )
          .join("\n\n")}\n${caseStudy.notes.join("\n\n")}\n${caseStudy.qa
          .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
          .join("\n\n")}`,
      ),
    },
    {
      id: `case-study-${caseStudy.slug}-challenge`,
      sourceType: "case-study" as const,
      title: `${caseStudy.title} Challenge`,
      slug: caseStudy.slug,
      text: stripMarkdown(caseStudy.challenge),
    },
    {
      id: `case-study-${caseStudy.slug}-outcome`,
      sourceType: "case-study" as const,
      title: `${caseStudy.title} Outcome`,
      slug: caseStudy.slug,
      text: stripMarkdown(caseStudy.outcome),
    },
    ...caseStudy.qa.map((entry, qaIndex) => ({
      id: `case-study-${caseStudy.slug}-qa-${qaIndex + 1}`,
      sourceType: "case-study" as const,
      title: `${caseStudy.title} ${entry.question}`,
      slug: caseStudy.slug,
      text: stripMarkdown(`${entry.question}\n${entry.answer}`),
    })),
  ],
);

const KNOWN_PORTFOLIO_ALIASES = {
  project: collectAliasPhrases(
    projectDocuments.flatMap((project) => [project.title, project.slug]),
  ),
  insight: collectAliasPhrases(
    insightPosts.flatMap((post) => [post.title, post.slug, post.category]),
  ),
  "case-study": collectAliasPhrases(
    caseStudies.flatMap((caseStudy) => [
      caseStudy.title,
      caseStudy.slug,
      ...caseStudy.tags,
    ]),
  ),
};

export const portfolioKnowledgeBase: Array<KnowledgeChunk> = [
  ...profileChunks,
  ...projectChunks,
  ...insightChunks,
  ...caseStudyChunks,
];

function scoreScope(query: string) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = Array.from(uniqueTokens(query));
  let score = 0;

  for (const token of PORTFOLIO_SCOPE_TERMS) {
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

  if (isProjectQuestion(query)) {
    score += 3;
  }

  if (isInsightQuestion(query)) {
    score += 3;
  }

  if (isCaseStudyQuestion(query)) {
    score += 3;
  }

  return score;
}

function hasKnownPortfolioAliasMatch(
  query: string,
  sourceTypes: Array<"project" | "insight" | "case-study">,
) {
  const normalizedQuery = normalizeAlias(query);

  if (!normalizedQuery) {
    return false;
  }

  return sourceTypes.some((sourceType) =>
    KNOWN_PORTFOLIO_ALIASES[sourceType].some(
      (alias) =>
        normalizedQuery.includes(alias) ||
        (normalizedQuery.length >= 6 && alias.includes(normalizedQuery)),
    ),
  );
}

function hasSpecificChunkMatch(query: string, chunk: KnowledgeChunk) {
  const normalizedQuery = normalizeAlias(query);
  const queryTokens = uniqueTokens(query);
  const aliasValues = collectAliasPhrases([chunk.title, chunk.slug]);

  if (
    aliasValues.some(
      (alias) =>
        normalizedQuery.includes(alias) ||
        (normalizedQuery.length >= 6 && alias.includes(normalizedQuery)),
    )
  ) {
    return true;
  }

  return aliasValues.some((alias) => {
    const aliasTokens = Array.from(uniqueTokens(alias));
    const overlap = aliasTokens.filter((token) => queryTokens.has(token)).length;
    return overlap >= Math.min(2, aliasTokens.length);
  });
}

function hasPortfolioContentSignal(
  retrievedChunks: ReturnType<typeof retrieveRelevantChunks>,
) {
  if (retrievedChunks.length === 0) {
    return false;
  }

  const topScore = retrievedChunks[0]?.score ?? 0;
  const portfolioChunkCount = retrievedChunks.filter(
    (entry) => entry.chunk.sourceType !== "profile",
  ).length;

  return topScore >= 2 || portfolioChunkCount >= 2;
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

  if (isProjectQuestion(query)) {
    if (chunk.sourceType === "project") {
      score += 5;
    }

    if (["Projects Summary"].includes(chunk.title)) {
      score += 4;
    }

    if (
      /what i built|summary|outcome|stack/i.test(chunk.title)
    ) {
      score += 2;
    }
  }

  if (isInsightQuestion(query)) {
    if (chunk.sourceType === "insight") {
      score += 5;
    }

    if (chunk.title === "Insights Summary") {
      score += 4;
    }

    if (/excerpt|content|takeaways/i.test(chunk.title)) {
      score += 2;
    }
  }

  if (isCaseStudyQuestion(query)) {
    if (chunk.sourceType === "case-study") {
      score += 5;
    }

    if (/case study|challenge|outcome/i.test(chunk.title)) {
      score += 2;
    }
  }

  if (
    (chunk.sourceType === "project" ||
      chunk.sourceType === "insight" ||
      chunk.sourceType === "case-study") &&
    hasSpecificChunkMatch(query, chunk)
  ) {
    score += 4;
  }

  return score;
}

export function retrieveRelevantChunks(
  query: string,
  limit = 5,
  pageContext?: PageContext,
) {
  let knowledgeBase = portfolioKnowledgeBase;
  const pageContextChunk = buildPageContextChunk(pageContext);

  if (pageContext?.type === "insight" && isPageRelativeQuestion(query)) {
    const matchingInsightChunks = portfolioKnowledgeBase.filter(
      (chunk) => chunk.sourceType === "insight" && chunk.slug === pageContext.slug,
    );

    if (matchingInsightChunks.length > 0) {
      knowledgeBase = [
        ...matchingInsightChunks,
        ...portfolioKnowledgeBase.filter(
          (chunk) =>
            !(chunk.sourceType === "insight" && chunk.slug === pageContext.slug),
        ),
      ];
    }
  }

  if (pageContext?.type === "case-study" && isPageRelativeQuestion(query)) {
    const matchingCaseStudyChunks = portfolioKnowledgeBase.filter(
      (chunk) => chunk.sourceType === "case-study" && chunk.slug === pageContext.slug,
    );

    if (matchingCaseStudyChunks.length > 0) {
      knowledgeBase = [
        ...matchingCaseStudyChunks,
        ...knowledgeBase.filter(
          (chunk) =>
            !(chunk.sourceType === "case-study" && chunk.slug === pageContext.slug),
        ),
      ];
    }
  }

  const scored = knowledgeBase
    .map((chunk) => ({
      chunk,
      score: scoreChunk(query, chunk),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (pageContextChunk) {
    const existingPageChunkIndex = scored.findIndex(
      (entry) =>
        entry.chunk.sourceType === pageContextChunk.sourceType &&
        entry.chunk.slug === pageContextChunk.slug,
    );

    const pageChunkScore = Math.max(scored[0]?.score ?? 0, 4) + 2;
    const pageChunkEntry = {
      chunk: pageContextChunk,
      score: pageChunkScore,
    };

    if (existingPageChunkIndex >= 0) {
      scored.splice(existingPageChunkIndex, 1, pageChunkEntry);
    } else {
      scored.unshift(pageChunkEntry);
    }
  }

  const topScored = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (
    topScored.length === 0 &&
    pageContext?.type === "insight" &&
    isPageRelativeQuestion(query)
  ) {
    return knowledgeBase
      .filter(
        (chunk) => chunk.sourceType === "insight" && chunk.slug === pageContext.slug,
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index + 2, 2),
      }));
  }

  if (
    topScored.length === 0 &&
    pageContext?.type === "case-study" &&
    isPageRelativeQuestion(query)
  ) {
    return knowledgeBase
      .filter(
        (chunk) =>
          chunk.sourceType === "case-study" && chunk.slug === pageContext.slug,
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index + 2, 2),
      }));
  }

  if (topScored.length > 0) {
    return topScored;
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

  if (isProjectQuestion(query)) {
    return portfolioKnowledgeBase
      .filter(
        (chunk) => chunk.sourceType === "project" || chunk.title === "Projects Summary",
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index, 1),
      }));
  }

  if (isInsightQuestion(query)) {
    return portfolioKnowledgeBase
      .filter(
        (chunk) => chunk.sourceType === "insight" || chunk.title === "Insights Summary",
      )
      .slice(0, limit)
      .map((chunk, index) => ({
        chunk,
        score: Math.max(limit - index, 1),
      }));
  }

  if (isCaseStudyQuestion(query)) {
    return portfolioKnowledgeBase
      .filter((chunk) => chunk.sourceType === "case-study")
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
  pageContext?: PageContext,
) {
  const scopeScore = scoreScope(query);
  const topScore = retrievedChunks[0]?.score ?? 0;
  const totalScore = retrievedChunks.reduce((sum, entry) => sum + entry.score, 0);
  const matchedChunkCount = retrievedChunks.length;

  const hasStrongPortfolioIntent = scopeScore >= 2;
  const hasStrongRetrieval = topScore >= 3 || totalScore >= 5;
  const hasEnoughSignal = matchedChunkCount >= 2 || totalScore >= 4;
  const isInsightPageRelativeQuestion =
    pageContext?.type === "insight" &&
    isPageRelativeQuestion(query) &&
    retrievedChunks.some(
      (entry) =>
        entry.chunk.sourceType === "insight" &&
        entry.chunk.slug === pageContext.slug,
    );
  const isCaseStudyPageRelativeQuestion =
    pageContext?.type === "case-study" &&
    isPageRelativeQuestion(query) &&
    retrievedChunks.some(
      (entry) =>
        entry.chunk.sourceType === "case-study" &&
        entry.chunk.slug === pageContext.slug,
    );
  const hasCurrentPageDocument =
    Boolean(pageContext?.documentText?.trim()) &&
    retrievedChunks.some(
      (entry) =>
        entry.chunk.sourceType === pageContext?.type &&
        entry.chunk.slug === pageContext.slug,
    );

  if (
    isInsightPageRelativeQuestion ||
    isCaseStudyPageRelativeQuestion ||
    hasCurrentPageDocument
  ) {
    return hasStrongRetrieval || hasEnoughSignal;
  }

  if (
    hasKnownPortfolioAliasMatch(query, ["project", "insight", "case-study"]) &&
    retrievedChunks.some(
      (entry) =>
        (entry.chunk.sourceType === "project" ||
          entry.chunk.sourceType === "insight" ||
          entry.chunk.sourceType === "case-study") &&
        hasSpecificChunkMatch(query, entry.chunk),
    )
  ) {
    return hasStrongRetrieval || topScore >= 2;
  }

  if (
    isJobHistoryQuestion(query) ||
    isProjectQuestion(query) ||
    isCaseStudyQuestion(query) ||
    isInsightQuestion(query)
  ) {
    return hasStrongRetrieval || hasEnoughSignal;
  }

  return hasStrongPortfolioIntent && hasStrongRetrieval && hasEnoughSignal;
}

export function classifyQueryIntent(
  query: string,
  retrievedChunks: ReturnType<typeof retrieveRelevantChunks>,
  pageContext?: PageContext,
): QueryIntent {
  if (isGreeting(query) || isHelpPrompt(query) || isLightConversation(query)) {
    return { mode: "smalltalk" };
  }

  if (
    retrievedChunks.length > 0 &&
    shouldAnswerFromProfile(query, retrievedChunks, pageContext)
  ) {
    return { mode: "answer" };
  }

  if (isInsightQuestion(query)) {
    return {
      mode: "clarify",
      clarification:
        "I think you're asking about one of my insights. Do you mean my writing on AI product clarity, trust in AI interfaces, or shipping fast without looking rushed?",
    };
  }

  if (isProjectQuestion(query) || isCaseStudyQuestion(query)) {
    return {
      mode: "clarify",
      clarification:
        "I think you're asking about one of my projects or case studies. I can talk about the Reachy Mini Mandarin tutor, AgentsOnly, the African pest detector, Green Room, or Clawcast. Which one would you like to explore?",
    };
  }

  if (isJobHistoryQuestion(query) || isTeachingQuestion(query)) {
    return {
      mode: "clarify",
      clarification:
        "I can help with my role history and teaching background. Do you want to know about my current role, previous roles, or my teaching experience?",
    };
  }

  if (
    hasPortfolioContentSignal(retrievedChunks) &&
    (scoreScope(query) >= 1 ||
      retrievedChunks.some(
        (entry) =>
          entry.chunk.sourceType === "project" ||
          entry.chunk.sourceType === "insight" ||
          entry.chunk.sourceType === "case-study",
      ))
  ) {
    return {
      mode: "clarify",
      clarification:
        "I think you're asking about something in my portfolio. I can help with my projects, case studies, writing, or experience. What would you like me to focus on?",
    };
  }

  if (isLikelyPortfolioQuestion(query)) {
    return {
      mode: "clarify",
      clarification:
        "I can help with my background, projects, and insights. Do you want to ask about my experience, something I've built, or something I've written?",
    };
  }

  return { mode: "refuse" };
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
    matchTitles: ["Projects Summary"],
    question: "Would you like me to walk you through one of those projects in more detail?",
  },
  {
    matchTitles: ["Insights Summary"],
    question: "Would you like me to share another insight I have written about?",
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

  if (chunks.some((chunk) => chunk.sourceType === "project")) {
    return "Would you like me to walk you through one of those projects in more detail?";
  }

  if (chunks.some((chunk) => chunk.sourceType === "insight")) {
    return "Would you like me to share another insight I have written about?";
  }

  return "Would you like to explore another part of my background?";
}
