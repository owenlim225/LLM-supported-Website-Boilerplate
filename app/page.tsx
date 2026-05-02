import Link from "next/link";

type ResourceItem =
  | {
      title: string;
      description: string;
      href: string;
      external: boolean;
    }
  | {
      title: string;
      description: string;
      static: true;
    };

const resources: ResourceItem[] = [
  {
    title: "Next.js Docs",
    description: "App Router, APIs, and deployment guides.",
    href: "https://nextjs.org/docs",
    external: true,
  },
  {
    title: "Health check",
    description: "JSON status from the sample API route.",
    href: "/api/health",
    external: false,
  },
  {
    title: "AI workflow",
    description: "AGENTS.md, .cursor/rules, and skills — open those paths in your repo.",
    static: true,
  },
  {
    title: "Deploy",
    description: "Ship to Vercel or your host of choice.",
    href: "https://vercel.com/new",
    external: true,
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-zinc-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-zinc-50 text-zinc-950">
      <div className="relative flex flex-1 flex-col items-center px-6 pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-zinc-600 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            LLM supported website boilerplate
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome — your app is running.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg text-zinc-600">
            This starter mirrors the familiar first-run experience of frameworks like Next.js: a
            clean home page you replace with your product. ECC-style conventions (skills, rules,
            agents) ship alongside the App Router shell.
          </p>

          <p className="mt-8 font-mono text-sm text-zinc-500">
            Get started by editing{" "}
            <code className="rounded-md bg-zinc-200/80 px-2 py-1 text-zinc-900">app/page.tsx</code>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Save the file — the dev server will hot-reload your changes.
          </p>
        </div>

        <ul className="relative z-10 mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {resources.map((item) => {
            // Anchors/Link default to inline; without block + full width, grid cells collapse
            // and card backgrounds clip/overlap.
            const cardClass =
              "group block w-full min-w-0 rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300 hover:shadow-md";

            const body = (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-zinc-900">{item.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
                </div>
                {"static" in item && item.static ? (
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500"
                  >
                    Local
                  </span>
                ) : (
                  <ArrowIcon />
                )}
              </div>
            );

            if ("static" in item && item.static) {
              return (
                <li key={item.title} className="min-w-0">
                  <div className={`${cardClass} cursor-default`}>{body}</div>
                </li>
              );
            }

            // Narrow union: static branch has no href; TS does not infer link-only after the guard above.
            if (!("href" in item)) {
              return null;
            }

            const { href, external, title } = item;

            return (
              <li key={title} className="min-w-0">
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {body}
                  </a>
                ) : (
                  <Link href={href} className={cardClass}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <footer className="relative z-10 mt-auto pt-16 text-center text-sm text-zinc-500">
          Next.js 16 · React 19 · TypeScript — LLM Supported Website Boilerplate
        </footer>
      </div>
    </main>
  );
}
