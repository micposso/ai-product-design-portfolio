import { MetadataRoute } from "next";

import { caseStudies } from "@/lib/case-studies";
import { insightPosts } from "@/lib/insights";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/case-study"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/insights"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/education"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...caseStudies.map((caseStudy) => ({
      url: absoluteUrl(`/case-study/${caseStudy.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...insightPosts.map((post) => ({
      url: absoluteUrl(`/insights/${post.slug}`),
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

