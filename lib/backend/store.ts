import { ContentItem, LinkedAccount, SyncLog, User } from "@/lib/backend/types";

const nowIso = () => new Date().toISOString();

const users: User[] = [
  { id: "member-1", email: "member@gdc.local", displayName: "GDC Member", role: "member" },
  { id: "admin-1", email: "admin@gdc.local", displayName: "GDC Admin", role: "admin" },
];

const linkedAccounts: LinkedAccount[] = [];
const contentItems: ContentItem[] = [];
const syncLogs: SyncLog[] = [];

export const db = {
  getUserById(id: string): User | null {
    return users.find((user) => user.id === id) ?? null;
  },
  createLinkedAccount(account: Omit<LinkedAccount, "createdAt" | "updatedAt">): LinkedAccount {
    const created: LinkedAccount = { ...account, createdAt: nowIso(), updatedAt: nowIso() };
    linkedAccounts.push(created);
    return created;
  },
  getLinkedAccountById(id: string): LinkedAccount | null {
    return linkedAccounts.find((account) => account.id === id) ?? null;
  },
  updateLinkedAccount(
    id: string,
    patch: Partial<Pick<LinkedAccount, "linkStatus">>,
  ): LinkedAccount | null {
    const existing = linkedAccounts.find((account) => account.id === id);
    if (!existing) {
      return null;
    }
    const updated: LinkedAccount = { ...existing, ...patch, updatedAt: nowIso() };
    const index = linkedAccounts.findIndex((account) => account.id === id);
    linkedAccounts.splice(index, 1, updated);
    return updated;
  },
  upsertContentItems(items: ContentItem[]): ContentItem[] {
    return items.map((incoming) => {
      const existingIndex = contentItems.findIndex(
        (item) =>
          item.provider === incoming.provider &&
          item.externalItemId === incoming.externalItemId &&
          item.linkedAccountId === incoming.linkedAccountId,
      );
      if (existingIndex < 0) {
        contentItems.push(incoming);
        return incoming;
      }
      const existing = contentItems[existingIndex];
      const merged: ContentItem = {
        ...existing,
        ...incoming,
        moderationStatus: existing.moderationStatus,
        updatedAt: nowIso(),
      };
      contentItems.splice(existingIndex, 1, merged);
      return merged;
    });
  },
  updateContentItemModeration(id: string, moderationStatus: ContentItem["moderationStatus"]): ContentItem | null {
    const existing = contentItems.find((item) => item.id === id);
    if (!existing) {
      return null;
    }
    const updated: ContentItem = { ...existing, moderationStatus, updatedAt: nowIso() };
    const index = contentItems.findIndex((item) => item.id === id);
    contentItems.splice(index, 1, updated);
    return updated;
  },
  getPublicContent(filters: {
    provider?: string;
    mediaType?: string;
    userId?: string;
    tag?: string;
  }): ContentItem[] {
    return contentItems.filter((item) => {
      if (item.moderationStatus !== "approved" || item.visibility !== "public") {
        return false;
      }
      if (filters.provider && item.provider !== filters.provider) {
        return false;
      }
      if (filters.mediaType && item.mediaType !== filters.mediaType) {
        return false;
      }
      if (filters.userId && item.userId !== filters.userId) {
        return false;
      }
      if (filters.tag && !item.tags.includes(filters.tag)) {
        return false;
      }
      return true;
    });
  },
  createSyncLog(log: SyncLog): SyncLog {
    syncLogs.push(log);
    return log;
  },
};

