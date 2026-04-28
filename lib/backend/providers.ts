import { MediaType, Provider } from "@/lib/backend/types";

export interface RawProviderItem {
  externalItemId: string;
  title: string;
  canonicalUrl: string;
  mediaType: MediaType;
  tags: string[];
  excerpt?: string;
  publishedAt?: string;
}

export interface ProviderAdapter {
  provider: Provider;
  validateLink(input: string): { valid: boolean; profileUrl?: string };
  fetchItems(accountRef: string): Promise<RawProviderItem[]>;
}

function validateWhitelistedProfileUrl(input: string, allowedHosts: string[]): string | null {
  try {
    const raw = input.startsWith("http") ? input : `https://${input}`;
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") {
      return null;
    }
    const hostAllowed = allowedHosts.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
    if (!hostAllowed) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

const itchioAdapter: ProviderAdapter = {
  provider: "itchio",
  validateLink(input) {
    const sanitized = input.trim();
    if (!sanitized || sanitized.length < 3) {
      return { valid: false };
    }
    const inferred = sanitized.includes(".") ? sanitized : `${sanitized}.itch.io`;
    const profileUrl = validateWhitelistedProfileUrl(inferred, ["itch.io"]);
    if (!profileUrl) {
      return { valid: false };
    }
    return { valid: true, profileUrl };
  },
  async fetchItems(accountRef) {
    return [
      {
        externalItemId: `${accountRef}-game-1`,
        title: `Sample Game from ${accountRef}`,
        canonicalUrl: `https://${accountRef}.itch.io/sample-game`,
        mediaType: "game",
        tags: ["indie", "student"],
        excerpt: "Playable prototype from GDC member profile.",
      },
    ];
  },
};

const mediumAdapter: ProviderAdapter = {
  provider: "medium",
  validateLink(input) {
    const sanitized = input.trim();
    if (!sanitized) {
      return { valid: false };
    }
    const inferred = sanitized.startsWith("http") ? sanitized : `https://medium.com/@${sanitized}`;
    const profileUrl = validateWhitelistedProfileUrl(inferred, ["medium.com"]);
    if (!profileUrl) {
      return { valid: false };
    }
    return { valid: true, profileUrl };
  },
  async fetchItems(accountRef) {
    return [
      {
        externalItemId: `${accountRef}-article-1`,
        title: `Devlog by ${accountRef}`,
        canonicalUrl: `https://medium.com/@${accountRef}/devlog`,
        mediaType: "article",
        tags: ["devlog", "gdc"],
        excerpt: "Progress update and lessons learned.",
      },
    ];
  },
};

const adapters: Record<Provider, ProviderAdapter> = {
  itchio: itchioAdapter,
  medium: mediumAdapter,
};

export function getAdapter(provider: Provider): ProviderAdapter {
  return adapters[provider];
}

