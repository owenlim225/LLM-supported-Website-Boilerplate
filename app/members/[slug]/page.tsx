import { notFound } from "next/navigation";

type MemberContent = {
  id: string;
  title: string;
  project: string;
  contentType: "trailer" | "devlog" | "screenshot-set" | "demo-build";
  status: "approved";
  publishedAt: string;
  excerpt: string;
};

type MemberProfile = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  yearLevel: string;
  connectedPlatforms: Array<{
    label: string;
    handle: string;
    href: string;
  }>;
  approvedContent: MemberContent[];
};

const MEMBERS: MemberProfile[] = [
  {
    slug: "althea-ramos",
    name: "Althea Ramos",
    role: "Gameplay Programmer",
    bio: "Builds systems-heavy mechanics and mentors first-year members in Unity workflows.",
    yearLevel: "3rd Year BSCS",
    connectedPlatforms: [
      { label: "GitHub", handle: "@althear-dev", href: "https://github.com" },
      { label: "itch.io", handle: "althea-gdc", href: "https://itch.io" },
      {
        label: "YouTube",
        handle: "@AltheaBuildsGames",
        href: "https://youtube.com",
      },
    ],
    approvedContent: [
      {
        id: "ct-001",
        title: "Skyline Raid Co-op Loop Trailer",
        project: "Skyline Raid",
        contentType: "trailer",
        status: "approved",
        publishedAt: "2026-04-18",
        excerpt:
          "A 90-second trailer showing squad abilities, wave escalation, and boss encounters.",
      },
      {
        id: "ct-002",
        title: "Rift & Root Combat Prototype Devlog",
        project: "Rift & Root",
        contentType: "devlog",
        status: "approved",
        publishedAt: "2026-04-09",
        excerpt:
          "Breakdown of turn-order mechanics, unit counters, and map terrain interactions.",
      },
    ],
  },
  {
    slug: "noel-mendez",
    name: "Noel Mendez",
    role: "Technical Artist",
    bio: "Creates shader-driven visual style guides and supports optimization on low-end devices.",
    yearLevel: "2nd Year BSIT",
    connectedPlatforms: [
      {
        label: "ArtStation",
        handle: "noel-mendez",
        href: "https://www.artstation.com",
      },
      { label: "itch.io", handle: "noel-gdc", href: "https://itch.io" },
    ],
    approvedContent: [
      {
        id: "ct-003",
        title: "Barangay Dash Environment Screenshot Set",
        project: "Barangay Dash",
        contentType: "screenshot-set",
        status: "approved",
        publishedAt: "2026-04-12",
        excerpt:
          "Curated screenshots highlighting stylized lighting and modular street assets.",
      },
    ],
  },
];

type MemberPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemberPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = MEMBERS.find((entry) => entry.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="flex-1 bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-5xl px-6 py-12 md:py-16">
        <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Member Profile
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {member.name}
          </h1>
          <p className="mt-2 text-zinc-300">
            {member.role} • {member.yearLevel}
          </p>
          <p className="mt-4 max-w-3xl text-zinc-200">{member.bio}</p>
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Connected Platforms</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {member.connectedPlatforms.map((platform) => (
              <a
                key={`${member.slug}-${platform.label}`}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-600"
              >
                <p className="font-medium">{platform.label}</p>
                <p className="text-sm text-zinc-300">{platform.handle}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Approved Content</h2>
          <div className="mt-4 space-y-4">
            {member.approvedContent.map((content) => (
              <article
                key={content.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{content.title}</h3>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
                    {content.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-300">
                  {content.project} •{" "}
                  <span className="capitalize">{content.contentType}</span>
                </p>
                <p className="mt-3 text-sm text-zinc-200">{content.excerpt}</p>
                <p className="mt-3 text-xs text-zinc-400">
                  Published {new Date(content.publishedAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
