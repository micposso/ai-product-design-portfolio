import { caseStudies } from "@/lib/case-studies";
import { insightPosts } from "@/lib/insights";
import { profileDocument } from "@/lib/profile";
import { projectDocuments } from "@/lib/projects";

export type PortfolioCollection =
  | "profile"
  | "projects"
  | "case-studies"
  | "insights";

function truncate(text: string, maxLength = 280) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export function getProfilePayload() {
  return {
    name: profileDocument.name,
    intro: profileDocument.intro,
    sections: profileDocument.sections,
    experienceEntries: profileDocument.experienceEntries,
  };
}

export function getProjectSummaries() {
  return projectDocuments.map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: truncate(project.summary || project.sections[0]?.content || ""),
    url: `/case-study/${project.slug}`,
  }));
}

export function getProjectBySlug(slug: string) {
  return projectDocuments.find((project) => project.slug === slug) ?? null;
}

export function getCaseStudySummaries() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
    title: caseStudy.title,
    summary: truncate(caseStudy.summary),
    tags: caseStudy.tags,
    url: `/case-study/${caseStudy.slug}`,
  }));
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug) ?? null;
}

export function getInsightSummaries() {
  return insightPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: truncate(post.excerpt),
    category: post.category,
    publishedAt: post.publishedAt,
    url: `/insights/${post.slug}`,
  }));
}

export function getInsightBySlug(slug: string) {
  return insightPosts.find((post) => post.slug === slug) ?? null;
}

export function getPortfolioIndex() {
  return {
    profile: getProfilePayload(),
    projects: getProjectSummaries(),
    caseStudies: getCaseStudySummaries(),
    insights: getInsightSummaries(),
  };
}

export function getPortfolioCollection(
  collection: PortfolioCollection,
  slug?: string | null,
) {
  if (collection === "profile") {
    return getProfilePayload();
  }

  if (collection === "projects") {
    return slug ? getProjectBySlug(slug) : getProjectSummaries();
  }

  if (collection === "case-studies") {
    return slug ? getCaseStudyBySlug(slug) : getCaseStudySummaries();
  }

  return slug ? getInsightBySlug(slug) : getInsightSummaries();
}

export function formatProfileText() {
  const profile = getProfilePayload();

  return [
    `${profile.name}`,
    "",
    profile.intro,
    "",
    ...profile.sections.map((section) => `${section.title}\n${section.content}`),
  ].join("\n");
}

export function formatProjectListText() {
  return getProjectSummaries()
    .map((project) => `- ${project.title} (${project.slug}): ${project.summary}`)
    .join("\n");
}

export function formatInsightListText() {
  return getInsightSummaries()
    .map(
      (insight) =>
        `- ${insight.title} (${insight.slug}, ${insight.publishedAt}): ${insight.excerpt}`,
    )
    .join("\n");
}

export function formatCaseStudyListText() {
  return getCaseStudySummaries()
    .map(
      (caseStudy) =>
        `- ${caseStudy.title} (${caseStudy.slug}): ${caseStudy.summary}`,
    )
    .join("\n");
}
