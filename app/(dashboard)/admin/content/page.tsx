"use client";

import { useState } from "react";

type Row = {
  id: string;
  title: string;
  member: string;
  provider: "itch.io" | "medium";
  status: "pending" | "approved" | "needs_changes" | "rejected";
};

const INITIAL_ROWS: Row[] = [
  {
    id: "c1",
    title: "Skyline Raid",
    member: "Althea Ramos",
    provider: "itch.io",
    status: "pending",
  },
  {
    id: "c2",
    title: "Campus Jam Recap",
    member: "Noel Mendez",
    provider: "medium",
    status: "needs_changes",
  },
];

export default function AdminContentPage() {
  const [rows, setRows] = useState(INITIAL_ROWS);

  const setStatus = (id: string, status: Row["status"]) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Admin - Content Moderation</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Review pending content before public visibility.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Member</th>
              <th className="px-2 py-2">Provider</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-2 py-3">{row.title}</td>
                <td className="px-2 py-3">{row.member}</td>
                <td className="px-2 py-3">{row.provider}</td>
                <td className="px-2 py-3 capitalize">{row.status.replace("_", " ")}</td>
                <td className="px-2 py-3">
                  <select
                    value={row.status}
                    onChange={(event) => setStatus(row.id, event.target.value as Row["status"])}
                    className="rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="needs_changes">Needs Changes</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

