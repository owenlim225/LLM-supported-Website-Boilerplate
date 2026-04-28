"use client";

import { FormEvent, useMemo, useState } from "react";

type AccountStatus = "Connected" | "Reauth Required";

type LinkedAccount = {
  id: string;
  provider: string;
  username: string;
  status: AccountStatus;
  connectedAt: string;
};

const INITIAL_LINKED_ACCOUNTS: LinkedAccount[] = [
  {
    id: "acct-1",
    provider: "Facebook",
    username: "gdc.community",
    status: "Connected",
    connectedAt: "2026-04-25",
  },
  {
    id: "acct-2",
    provider: "Instagram",
    username: "@uphslgdc",
    status: "Reauth Required",
    connectedAt: "2026-04-10",
  },
];

export default function MemberLinksPage() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(
    INITIAL_LINKED_ACCOUNTS,
  );
  const [provider, setProvider] = useState("Facebook");
  const [username, setUsername] = useState("");

  const canSubmit = useMemo(() => username.trim().length > 1, [username]);

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const newAccount: LinkedAccount = {
      id: `acct-${Date.now()}`,
      provider,
      username: username.trim(),
      status: "Connected",
      connectedAt: new Date().toISOString().slice(0, 10),
    };

    setLinkedAccounts((prev) => [newAccount, ...prev]);
    setUsername("");
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Linked Accounts
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connect your social accounts to publish content from one place.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Connected Accounts
          </h2>
          <ul className="space-y-3">
            {linkedAccounts.map((account) => (
              <li
                key={account.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {account.provider}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {account.username} - Connected {account.connectedAt}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                    account.status === "Connected"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {account.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Connect Account
          </h2>
          <form className="space-y-4" onSubmit={handleConnect}>
            <div className="space-y-1">
              <label
                htmlFor="provider"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Provider
              </label>
              <select
                id="provider"
                value={provider}
                onChange={(event) => setProvider(event.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option>Facebook</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>X</option>
              </select>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Page or Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. @uphslgdc"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Connect Account
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
