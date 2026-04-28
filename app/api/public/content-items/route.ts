import { NextRequest } from "next/server";

import { ok } from "@/lib/backend/http";
import { db } from "@/lib/backend/store";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const provider = searchParams.get("provider") ?? undefined;
  const mediaType = searchParams.get("mediaType") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const limitRaw = Number(searchParams.get("limit") ?? "20");
  const offsetRaw = Number(searchParams.get("offset") ?? "0");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(50, Math.floor(limitRaw))) : 20;
  const offset = Number.isFinite(offsetRaw) ? Math.max(0, Math.floor(offsetRaw)) : 0;

  const contentItems = db.getPublicContent({ provider, mediaType, userId, tag });
  const paginated = contentItems.slice(offset, offset + limit);
  return ok({
    items: paginated,
    filters: { provider, mediaType, userId, tag, limit, offset },
    total: contentItems.length,
  });
}

