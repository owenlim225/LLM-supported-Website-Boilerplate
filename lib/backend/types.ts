export type UserRole = "member" | "admin";

export type Provider = "itchio" | "medium";

export type LinkStatus = "pending_review" | "approved" | "rejected";

export type ModerationStatus = "pending_review" | "approved" | "rejected";

export type Visibility = "public" | "hidden_by_member";

export type MediaType = "game" | "article" | "event" | "other";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface LinkedAccount {
  id: string;
  userId: string;
  provider: Provider;
  externalUsernameOrSlug: string;
  profileUrl: string;
  linkStatus: LinkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  userId: string;
  linkedAccountId: string;
  provider: Provider;
  externalItemId: string;
  mediaType: MediaType;
  title: string;
  canonicalUrl: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  tags: string[];
  excerpt: string | null;
  moderationStatus: ModerationStatus;
  visibility: Visibility;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  linkedAccountId: string;
  triggeredByUserId: string;
  triggerMode: "manual";
  status: "success" | "partial_success" | "failed";
  itemsFetched: number;
  itemsNormalized: number;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
}

