export default function Home() {
  return (
    <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16 md:py-24">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-1 text-sm font-medium text-zinc-300">
            Clean slate
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start building from here.
          </h1>
          <p className="text-lg text-zinc-300">
            This repository is a minimal Next.js App Router shell with shared AI workflow
            conventions under{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-emerald-300">
              .cursor/
            </code>
            . Replace this page, add routes under{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-emerald-300">
              app/
            </code>
            , and wire your product spec when you are ready.
          </p>
        </div>
        <p className="text-sm text-zinc-500">
          Health check:{" "}
          <a
            className="text-emerald-400 underline-offset-4 hover:underline"
            href="/api/health"
          >
            /api/health
          </a>
        </p>
      </section>
    </main>
  );
}
