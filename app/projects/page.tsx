"use client";

import { useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  summary: string;
  members: string[];
  platforms: string[];
  mediaType: "gameplay" | "screenshot" | "teaser";
  tags: string[];
  updatedAt: string;
};

const PROJECTS: Project[] = [
  {
    id: "skyline-raid",
    title: "Skyline Raid",
    summary: "Co-op arcade shooter where teams defend floating city cores.",
    members: ["Althea Ramos", "Noel Mendez", "Ivy Cruz"],
    platforms: ["PC", "Web"],
    mediaType: "gameplay",
    tags: ["multiplayer", "arcade", "action"],
    updatedAt: "2026-04-21",
  },
  {
    id: "echoes-below",
    title: "Echoes Below",
    summary: "Narrative puzzle game set inside a submerged library.",
    members: ["Ethan Lim", "Justine Garcia"],
    platforms: ["PC"],
    mediaType: "teaser",
    tags: ["story", "puzzle", "atmospheric"],
    updatedAt: "2026-04-15",
  },
  {
    id: "barangay-dash",
    title: "Barangay Dash",
    summary: "Endless runner inspired by local culture and landmarks.",
    members: ["Mika Torres", "Noel Mendez"],
    platforms: ["Android", "Web"],
    mediaType: "screenshot",
    tags: ["mobile", "casual", "runner"],
    updatedAt: "2026-04-10",
  },
  {
    id: "rift-and-root",
    title: "Rift & Root",
    summary: "Turn-based strategy prototype with ecosystem mechanics.",
    members: ["Althea Ramos", "Ralph Yu"],
    platforms: ["PC"],
    mediaType: "gameplay",
    tags: ["strategy", "prototype", "systems"],
    updatedAt: "2026-04-07",
  },
];

const ALL = "All";

export default function ProjectsPage() {
  const [memberFilter, setMemberFilter] = useState(ALL);
  const [platformFilter, setPlatformFilter] = useState(ALL);
  const [mediaFilter, setMediaFilter] = useState(ALL);
  const [tagQuery, setTagQuery] = useState("");

  const memberOptions = useMemo(
    () => [ALL, ...new Set(PROJECTS.flatMap((project) => project.members))],
    [],
  );
  const platformOptions = useMemo(
    () => [ALL, ...new Set(PROJECTS.flatMap((project) => project.platforms))],
    [],
  );
  const mediaOptions = useMemo(
    () => [ALL, ...new Set(PROJECTS.map((project) => project.mediaType))],
    [],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = tagQuery.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const memberMatch =
        memberFilter === ALL || project.members.includes(memberFilter);
      const platformMatch =
        platformFilter === ALL || project.platforms.includes(platformFilter);
      const mediaMatch = mediaFilter === ALL || project.mediaType === mediaFilter;
      const tagMatch =
        normalizedQuery.length === 0 ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return memberMatch && platformMatch && mediaMatch && tagMatch;
    });
  }, [memberFilter, platformFilter, mediaFilter, tagQuery]);

  return (
    <main className="flex-1 bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
            Club Projects
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Discover what our teams are building
          </h1>
          <p className="max-w-3xl text-zinc-300">
            Filter by member, platform, media type, or tag to explore submitted
            project highlights.
          </p>
        </header>

        <section className="mt-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:grid-cols-4">
          <FilterSelect
            label="Member"
            value={memberFilter}
            options={memberOptions}
            onChange={setMemberFilter}
          />
          <FilterSelect
            label="Platform"
            value={platformFilter}
            options={platformOptions}
            onChange={setPlatformFilter}
          />
          <FilterSelect
            label="Media Type"
            value={mediaFilter}
            options={mediaOptions}
            onChange={setMediaFilter}
          />
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-zinc-300">Tag contains</span>
            <input
              value={tagQuery}
              onChange={(event) => setTagQuery(event.target.value)}
              placeholder="e.g. multiplayer"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-emerald-400 transition focus:ring-2"
            />
          </label>
        </section>

        <p className="mt-6 text-sm text-zinc-400">
          Showing {filteredProjects.length} of {PROJECTS.length} projects
        </p>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="mt-2 text-sm text-zinc-300">{project.summary}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-zinc-400">Members</dt>
                  <dd>{project.members.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Platforms</dt>
                  <dd>{project.platforms.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Media</dt>
                  <dd className="capitalize">{project.mediaType}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={`${project.id}-${tag}`}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-emerald-400 transition focus:ring-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
