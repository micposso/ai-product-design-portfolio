import { NextResponse } from "next/server";

import {
  formatCaseStudyListText,
  formatInsightListText,
  formatProfileText,
  formatProjectListText,
  getCaseStudyBySlug,
  getInsightBySlug,
  getProjectBySlug,
} from "@/lib/agent-data";
import { absoluteUrl } from "@/lib/site";

type JsonRpcRequest = {
  id?: string | number | null;
  jsonrpc?: string;
  method?: string;
  params?: Record<string, unknown>;
};

function responseHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
}

function jsonRpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return NextResponse.json(
    {
      jsonrpc: "2.0",
      id: id ?? null,
      result,
    },
    { headers: responseHeaders() },
  );
}

function jsonRpcError(
  id: JsonRpcRequest["id"],
  code: number,
  message: string,
) {
  return NextResponse.json(
    {
      jsonrpc: "2.0",
      id: id ?? null,
      error: {
        code,
        message,
      },
    },
    { headers: responseHeaders() },
  );
}

function buildToolText(name: string, args: Record<string, unknown>) {
  if (name === "get_profile") {
    return {
      text: formatProfileText(),
      data: {
        profile: true,
      },
    };
  }

  if (name === "list_projects") {
    return {
      text: formatProjectListText(),
      data: {
        projects: true,
      },
    };
  }

  if (name === "list_case_studies") {
    return {
      text: formatCaseStudyListText(),
      data: {
        caseStudies: true,
      },
    };
  }

  if (name === "list_insights") {
    return {
      text: formatInsightListText(),
      data: {
        insights: true,
      },
    };
  }

  if (name === "get_project") {
    const slug = String(args.slug ?? "");
    const project = getProjectBySlug(slug);

    if (!project) {
      return null;
    }

    return {
      text: [project.title, "", project.summary, "", project.markdown].join("\n"),
      data: project,
    };
  }

  if (name === "get_case_study") {
    const slug = String(args.slug ?? "");
    const caseStudy = getCaseStudyBySlug(slug);

    if (!caseStudy) {
      return null;
    }

    return {
      text: [
        caseStudy.title,
        "",
        caseStudy.summary,
        "",
        caseStudy.challenge,
        "",
        caseStudy.outcome,
      ].join("\n"),
      data: caseStudy,
    };
  }

  if (name === "get_insight") {
    const slug = String(args.slug ?? "");
    const insight = getInsightBySlug(slug);

    if (!insight) {
      return null;
    }

    return {
      text: [insight.title, "", insight.excerpt, "", insight.markdown].join("\n"),
      data: insight,
    };
  }

  return null;
}

const tools = [
  {
    name: "get_profile",
    description: "Return Michael Posso's full profile and experience summary.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_projects",
    description: "List Michael Posso's portfolio projects with short summaries.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_project",
    description: "Get a specific project by slug.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: {
          type: "string",
        },
      },
    },
  },
  {
    name: "list_case_studies",
    description: "List case studies with summaries and tags.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_case_study",
    description: "Get a specific case study by slug.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: {
          type: "string",
        },
      },
    },
  },
  {
    name: "list_insights",
    description: "List insights posts with excerpts and publication dates.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_insight",
    description: "Get a specific insight post by slug.",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: {
          type: "string",
        },
      },
    },
  },
];

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: responseHeaders(),
  });
}

export async function GET() {
  return NextResponse.json(
    {
      name: "Michael Posso Portfolio MCP",
      endpoint: absoluteUrl("/api/mcp"),
      manifest: absoluteUrl("/.well-known/mcp.json"),
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
      })),
    },
    { headers: responseHeaders() },
  );
}

export async function POST(request: Request) {
  let body: JsonRpcRequest;

  try {
    body = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Invalid JSON body.");
  }

  if (body.jsonrpc !== "2.0" || !body.method) {
    return jsonRpcError(body.id, -32600, "Invalid JSON-RPC request.");
  }

  if (body.method === "initialize") {
    return jsonRpcResult(body.id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "Michael Posso Portfolio MCP",
        version: "1.0.0",
      },
    });
  }

  if (body.method === "ping") {
    return jsonRpcResult(body.id, {});
  }

  if (body.method === "tools/list") {
    return jsonRpcResult(body.id, {
      tools,
    });
  }

  if (body.method === "tools/call") {
    const name = String(body.params?.name ?? "");
    const args = (body.params?.arguments as Record<string, unknown> | undefined) ?? {};
    const result = buildToolText(name, args);

    if (!result) {
      return jsonRpcError(body.id, -32602, `Unknown tool or missing resource: ${name}`);
    }

    return jsonRpcResult(body.id, {
      content: [
        {
          type: "text",
          text: result.text,
        },
      ],
      structuredContent: result.data,
    });
  }

  return jsonRpcError(body.id, -32601, `Method not found: ${body.method}`);
}
