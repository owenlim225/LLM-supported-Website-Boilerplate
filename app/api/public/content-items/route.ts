import { NextRequest } from "next/server";

import { ok } from "@/lib/backend/http";
import { db } from "@/lib/backend/store";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const provider = searchParams.get("provider") ?? undefined;
  const mediaType = searchParams.get("mediaType") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const contentItems = db.getPublicContent({ provider, mediaType, userId, tag });
  return ok({
    items: contentItems,
    filters: { provider, mediaType, userId, tag },
    total: contentItems.length,
  });
}

