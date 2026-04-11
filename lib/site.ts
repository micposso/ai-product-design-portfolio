import { profileDocument } from "@/lib/profile";

export const siteConfig = {
  name: "Michael Posso",
  title: "Michael Posso | Agent-Native Product Engineer",
  description:
    "An agent-native portfolio for Michael Posso with structured profile data, case studies, insights, and a portfolio chat API.",
  url: "https://michaelposso.ai",
  email: "hello@michaelposso.ai",
  locale: "en_US",
  image: "/images/profile.jpg",
  keywords: [
    "Michael Posso",
    "agent-native portfolio",
    "AI product engineer",
    "agentic systems",
    "voice interfaces",
    "Next.js",
    "MCP",
    "OpenAPI",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function getHomepageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("#person"),
        name: siteConfig.name,
        url: siteConfig.url,
        image: absoluteUrl(siteConfig.image),
        jobTitle: "Product Marketing Engineer",
        description: profileDocument.intro,
        knowsAbout: siteConfig.keywords,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("#website"),
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        publisher: {
          "@id": absoluteUrl("#person"),
        },
      },
      {
        "@type": "WebPage",
        "@id": absoluteUrl("#webpage"),
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: {
          "@id": absoluteUrl("#website"),
        },
        about: {
          "@id": absoluteUrl("#person"),
        },
      },
    ],
  };
}
