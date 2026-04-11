import { NextResponse } from "next/server";

import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    schema_version: "v1",
    name_for_human: "Michael Posso Portfolio",
    name_for_model: "michael_posso_portfolio",
    description_for_human:
      "Read Michael Posso's profile, projects, case studies, and insights.",
    description_for_model:
      "Use this plugin to retrieve structured information about Michael Posso's background, projects, case studies, and insights. Prefer the structured portfolio endpoint for factual lookups, and use the chat endpoint for grounded natural-language answers about the portfolio only.",
    auth: {
      type: "none",
    },
    api: {
      type: "openapi",
      url: absoluteUrl("/openapi.json"),
      is_user_authenticated: false,
    },
    logo_url: absoluteUrl(siteConfig.image),
    contact_email: siteConfig.email,
    legal_info_url: absoluteUrl("/"),
  });
}

