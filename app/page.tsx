import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:py-24">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-1 text-sm font-medium text-zinc-300">
            UPHSL Community
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Build, ship, and celebrate student-made games at UPHSL.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300">
            The UPHSL Game Developers Club helps students learn game design,
            programming, art, and production through collaborative projects and
            community showcases.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Explore Projects
          </Link>
          <Link
            href="/members/althea-ramos"
            className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold transition hover:border-zinc-400 hover:bg-zinc-800"
          >
            View Member Profile
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Active Members", value: "65+" },
            { label: "Published Projects", value: "18" },
            { label: "Campus Game Jams", value: "6 / year" },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <p className="text-2xl font-bold text-emerald-300">{stat.value}</p>
              <p className="mt-2 text-sm text-zinc-300">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
