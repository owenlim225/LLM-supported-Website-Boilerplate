"use client";

import { useState } from "react";

type Row = {
  id: string;
  member: string;
  provider: "itch.io" | "medium";
  profile: string;
  status: "pending" | "approved" | "rejected";
};

const INITIAL_ROWS: Row[] = [
  {
    id: "l1",
    member: "John Rivera",
    provider: "itch.io",
    profile: "john-plays",
    status: "pending",
  },
  {
    id: "l2",
    member: "Maria Santos",
    provider: "medium",
    profile: "@maria.gdc",
    status: "pending",
  },
];

export default function AdminLinksPage() {
  const [rows, setRows] = useState(INITIAL_ROWS);

  const setStatus = (id: string, status: Row["status"]) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Admin - Link Moderation</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Approve or reject member-linked source accounts.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="px-2 py-2">Member</th>
              <th className="px-2 py-2">Provider</th>
              <th className="px-2 py-2">Profile</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-2 py-3">{row.member}</td>
                <td className="px-2 py-3">{row.provider}</td>
                <td className="px-2 py-3">{row.profile}</td>
                <td className="px-2 py-3 capitalize">{row.status}</td>
                <td className="px-2 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(row.id, "approved")}
                      className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(row.id, "rejected")}
                      className="rounded bg-rose-600 px-2 py-1 text-xs font-medium text-white"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

