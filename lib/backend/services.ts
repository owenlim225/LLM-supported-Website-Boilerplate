import { db } from "@/lib/backend/store";
import { AppError } from "@/lib/backend/errors";
import { getAdapter } from "@/lib/backend/providers";
import { ContentItem, LinkStatus, Provider, User } from "@/lib/backend/types";

const nowIso = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export function validateProvider(input: string): Provider | null {
  if (input === "itchio" || input === "medium") {
    return input;
  }
  return null;
}

export function createLinkRequest(params: {
  user: User;
  provider: Provider;
  usernameOrSlug: string;
}) {
  const adapter = getAdapter(params.provider);
  const checked = adapter.validateLink(params.usernameOrSlug);
  if (!checked.valid || !checked.profileUrl) {
    throw new AppError("Invalid provider account reference", 400);
  }
  return db.createLinkedAccount({
    id: makeId("link"),
    userId: params.user.id,
    provider: params.provider,
    externalUsernameOrSlug: params.usernameOrSlug,
    profileUrl: checked.profileUrl,
    linkStatus: "pending_review",
  });
}

export function moderateLinkedAccount(params: { linkId: string; status: LinkStatus }) {
  if (params.status === "pending_review") {
    throw new AppError("Invalid moderation status", 400);
  }
  const updated = db.updateLinkedAccount(params.linkId, { linkStatus: params.status });
  if (!updated) {
    throw new AppError("Linked account not found", 404);
  }
  return updated;
}

export async function refreshLinkedAccount(params: { linkId: string; user: User }) {
  const link = db.getLinkedAccountById(params.linkId);
  if (!link) {
    throw new AppError("Linked account not found", 404);
  }
  if (link.userId !== params.user.id && params.user.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }
  if (link.linkStatus !== "approved") {
    throw new AppError("Linked account must be approved before refresh", 400);
  }
  const adapter = getAdapter(link.provider);
  let raw;
  try {
    raw = await adapter.fetchItems(link.externalUsernameOrSlug);
  } catch {
    db.createSyncLog({
      id: makeId("sync"),
      linkedAccountId: link.id,
      triggeredByUserId: params.user.id,
      triggerMode: "manual",
      status: "failed",
      itemsFetched: 0,
      itemsNormalized: 0,
      errorCode: "provider_fetch_failed",
      errorMessage: "Provider fetch failed",
      createdAt: nowIso(),
    });
    throw new AppError("Provider fetch failed", 502);
  }
  const normalized: ContentItem[] = raw.map((item) => ({
    id: makeId("content"),
    userId: link.userId,
    linkedAccountId: link.id,
    provider: link.provider,
    externalItemId: item.externalItemId,
    mediaType: item.mediaType,
    title: item.title,
    canonicalUrl: item.canonicalUrl,
    thumbnailUrl: null,
    publishedAt: item.publishedAt ?? null,
    tags: [...item.tags],
    excerpt: item.excerpt ?? null,
    moderationStatus: "pending_review",
    visibility: "public",
    fetchedAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));
  const items = db.upsertContentItems(normalized);
  db.createSyncLog({
    id: makeId("sync"),
    linkedAccountId: link.id,
    triggeredByUserId: params.user.id,
    triggerMode: "manual",
    status: "success",
    itemsFetched: raw.length,
    itemsNormalized: items.length,
    errorCode: null,
    errorMessage: null,
    createdAt: nowIso(),
  });
  return items;
}

export function moderateContentItem(params: {
  contentItemId: string;
  status: "approved" | "rejected";
}) {
  const updated = db.updateContentItemModeration(params.contentItemId, params.status);
  if (!updated) {
    throw new AppError("Content item not found", 404);
  }
  return updated;
}

