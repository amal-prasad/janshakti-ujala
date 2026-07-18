export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/api/articles";

// Paginated article feed for the "और खबरें लोड करें" button.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    const page = await getArticles({
      category: sp.get("category") ?? undefined,
      tag: sp.get("tag") ?? undefined,
      cursor: sp.get("cursor"),
      limit: Number(sp.get("limit")) || 12,
    });
    return NextResponse.json(page);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}
