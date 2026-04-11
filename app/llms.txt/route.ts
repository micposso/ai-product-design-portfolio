import { NextResponse } from "next/server";

import {
  formatCaseStudyListText,
  formatInsightListText,
  formatProfileText,
  formatProjectListText,
} from "@/lib/agent-data";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const body = [
    `# ${siteConfig.title}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## About",
    "This site is a machine-readable portfolio for Michael Posso. It includes structured profile data, case studies, insights, and a chat endpoint grounded in portfolio content.",
    "",
    "## Canonical URLs",
    `- Homepage: ${absoluteUrl("/")}`,
    `- Case Studies Index: ${absoluteUrl("/case-study")}`,
    `- Insights Index: ${absoluteUrl("/insights")}`,
    `- OpenAPI schema: ${absoluteUrl("/openapi.json")}`,
    `- AI plugin manifest: ${absoluteUrl("/ai-plugin.json")}`,
    `- MCP manifest: ${absoluteUrl("/.well-known/mcp.json")}`,
    `- MCP endpoint: ${absoluteUrl("/api/mcp")}`,
    "",
    "## Agent Guidance",
    "- Prefer structured endpoints before scraping page HTML.",
    "- Use /api/portfolio for profile, projects, case studies, and insights.",
    "- Use /api/chat only for natural-language interaction about Michael Posso's background, projects, and insights.",
    "- Do not expect general web search, unrelated personal details, or off-topic answers from the chat endpoint.",
    "",
    "## Profile",
    formatProfileText(),
    "",
    "## Projects",
    formatProjectListText(),
    "",
    "## Case Studies",
    formatCaseStudyListText(),
    "",
    "## Insights",
    formatInsightListText(),
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

