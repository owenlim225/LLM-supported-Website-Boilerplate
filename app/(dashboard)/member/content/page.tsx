"use client";

import { useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  platform: string;
  visibility: boolean;
  lastSynced: string;
};

const INITIAL_CONTENT: ContentItem[] = [
  {
    id: "cnt-1",
    title: "GDC Orientation Highlights",
    platform: "Facebook",
    visibility: true,
    lastSynced: "5 mins ago",
  },
  {
    id: "cnt-2",
    title: "Tournament Teaser Clip",
    platform: "TikTok",
    visibility: false,
    lastSynced: "12 mins ago",
  },
  {
    id: "cnt-3",
    title: "Weekly Event Poster",
    platform: "Instagram",
    visibility: true,
    lastSynced: "2 hours ago",
  },
];

export default function MemberContentPage() {
  const [lastRefresh, setLastRefresh] = useState<string>("Never");
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT);

  const visibleCount = useMemo(
    () => contentItems.filter((item) => item.visibility).length,
    [contentItems],
  );

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleTimeString());
  };

  const toggleVisibility = (id: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visibility: !item.visibility } : item,
      ),
    );
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Content Visibility
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage refresh status and choose which posts are publicly visible.
        </p>
      </header>

      <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            <p>Last refresh: {lastRefresh}</p>
            <p>
              {visibleCount} of {contentItems.length} items visible
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Refresh Status
          </button>
        </div>
      </article>

      <article className="overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Content Items
        </h2>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Platform</th>
              <th className="px-3 py-2 font-medium">Last Synced</th>
              <th className="px-3 py-2 font-medium">Visibility</th>
            </tr>
          </thead>
          <tbody>
            {contentItems.map((item) => (
              <tr key={item.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-3 py-3 text-zinc-900 dark:text-zinc-100">{item.title}</td>
                <td className="px-3 py-3 text-zinc-700 dark:text-zinc-300">{item.platform}</td>
                <td className="px-3 py-3 text-zinc-700 dark:text-zinc-300">{item.lastSynced}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.visibility}
                    onClick={() => toggleVisibility(item.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.visibility
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {item.visibility ? "Visible" : "Hidden"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
