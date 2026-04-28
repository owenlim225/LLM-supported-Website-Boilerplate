import { NextRequest } from "next/server";

import { requireAdmin, requireUser } from "@/lib/backend/auth";
import { getErrorStatus } from "@/lib/backend/errors";
import { fail, ok } from "@/lib/backend/http";
import { moderateContentItem } from "@/lib/backend/services";

const isValidStatus = (status: string): status is "approved" | "rejected" =>
  status === "approved" || status === "rejected";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireUser(request);
    requireAdmin(user);
    const body = (await request.json()) as { status?: string };
    if (!body.status || !isValidStatus(body.status)) {
      return fail(400, "status must be approved or rejected");
    }
    const { id } = await context.params;
    const updated = moderateContentItem({ contentItemId: id, status: body.status });
    return ok(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return fail(getErrorStatus(error, 400), message);
  }
}

