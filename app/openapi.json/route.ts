import { NextResponse } from "next/server";

import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: `${siteConfig.name} Portfolio API`,
      version: "1.0.0",
      description:
        "Read-only structured access to Michael Posso's profile, projects, case studies, and insights, plus a chat endpoint for grounded portfolio Q&A.",
    },
    servers: [
      {
        url: siteConfig.url,
      },
    ],
    paths: {
      "/api/portfolio": {
        get: {
          operationId: "getPortfolioData",
          summary: "Get structured portfolio data",
          description:
            "Returns portfolio profile data or lists/details for projects, case studies, and insights.",
          parameters: [
            {
              name: "collection",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["profile", "projects", "case-studies", "insights"],
              },
              description:
                "When omitted, returns the full portfolio index. When provided, returns a specific collection.",
            },
            {
              name: "slug",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description:
                "Optional slug to fetch a specific project, case study, or insight.",
            },
          ],
          responses: {
            "200": {
              description: "Portfolio data returned successfully.",
            },
            "400": {
              description: "Invalid collection provided.",
            },
            "404": {
              description: "Requested slug not found.",
            },
          },
        },
      },
      "/api/chat": {
        post: {
          operationId: "chatWithPortfolioAgent",
          summary: "Chat with Michael Posso's portfolio agent",
          description:
            "Accepts a conversation payload and returns a streamed response grounded in Michael Posso's portfolio content.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id", "messages"],
                  properties: {
                    id: {
                      type: "string",
                    },
                    messages: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["id", "role", "content"],
                        properties: {
                          id: { type: "string" },
                          role: {
                            type: "string",
                            enum: ["user", "assistant", "system"],
                          },
                          content: {
                            type: "string",
                          },
                        },
                      },
                    },
                    pageContext: {
                      type: "object",
                      additionalProperties: true,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "A streamed chat response.",
            },
            "400": {
              description: "Invalid request payload.",
            },
            "429": {
              description: "Rate limit exceeded.",
            },
          },
        },
      },
      "/api/mcp": {
        post: {
          operationId: "callMcpEndpoint",
          summary: "Call the MCP endpoint",
          description:
            "JSON-RPC endpoint for tools that expose Michael Posso's profile, projects, case studies, and insights.",
          responses: {
            "200": {
              description: "JSON-RPC response.",
            },
          },
        },
      },
    },
    components: {},
    externalDocs: {
      description: "LLMs guide",
      url: absoluteUrl("/llms.txt"),
    },
  });
}

