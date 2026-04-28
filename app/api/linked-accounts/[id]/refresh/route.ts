import { NextRequest } from "next/server";

import { requireUser } from "@/lib/backend/auth";
import { getClientErrorMessage, getErrorStatus } from "@/lib/backend/errors";
import { fail, ok } from "@/lib/backend/http";
import { refreshLinkedAccount } from "@/lib/backend/services";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireUser(request);
    const { id } = await context.params;
    const items = await refreshLinkedAccount({ linkId: id, user });
    return ok({ itemsCreatedOrUpdated: items.length, items });
  } catch (error) {
    return fail(getErrorStatus(error, 500), getClientErrorMessage(error));
  }
}

