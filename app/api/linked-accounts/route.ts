import { NextRequest } from "next/server";

import { requireUser } from "@/lib/backend/auth";
import { getErrorStatus } from "@/lib/backend/errors";
import { fail, ok } from "@/lib/backend/http";
import { createLinkRequest, validateProvider } from "@/lib/backend/services";

export async function POST(request: NextRequest) {
  try {
    const user = requireUser(request);
    const body = (await request.json()) as {
      provider?: string;
      usernameOrSlug?: string;
    };
    const provider = validateProvider(body.provider ?? "");
    if (!provider || !body.usernameOrSlug) {
      return fail(400, "provider and usernameOrSlug are required");
    }
    const linkedAccount = createLinkRequest({
      user,
      provider,
      usernameOrSlug: body.usernameOrSlug,
    });
    return ok(linkedAccount, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return fail(getErrorStatus(error, 400), message);
  }
}

