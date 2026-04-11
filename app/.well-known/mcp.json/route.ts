import { NextResponse } from "next/server";

import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    name: "Michael Posso Portfolio MCP",
    version: "1.0.0",
    description:
      "Read-only MCP server for Michael Posso's portfolio profile, projects, case studies, and insights.",
    transport: {
      type: "http",
      url: absoluteUrl("/api/mcp"),
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    documentation_url: absoluteUrl("/llms.txt"),
  });
}

