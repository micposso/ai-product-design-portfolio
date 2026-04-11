import { NextResponse } from "next/server";

import {
  PortfolioCollection,
  getPortfolioCollection,
  getPortfolioIndex,
} from "@/lib/agent-data";

const validCollections = new Set<PortfolioCollection>([
  "profile",
  "projects",
  "case-studies",
  "insights",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") as PortfolioCollection | null;
  const slug = searchParams.get("slug");

  if (!collection) {
    return NextResponse.json(getPortfolioIndex());
  }

  if (!validCollections.has(collection)) {
    return NextResponse.json(
      {
        error:
          "Invalid collection. Use one of: profile, projects, case-studies, insights.",
      },
      { status: 400 },
    );
  }

  const data = getPortfolioCollection(collection, slug);

  if (!data) {
    return NextResponse.json(
      { error: `No ${collection} entry found for slug "${slug}".` },
      { status: 404 },
    );
  }

  return NextResponse.json({
    collection,
    slug,
    data,
  });
}

