import data from "@/data/github.json";

// The live half of the content: what scripts/github.mjs last read from the
// GitHub API (daily, by .github/workflows/github-data.yml). Everything here
// is a count or a date GitHub reports, so it's checkable by construction.

export type Repo = {
  repo: string;
  name: string;
  from: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  commits: number;
  pushed: string | null;
  fork: boolean;
  release: { tag: string; date: string | null; url: string } | null;
};

export type Calendar = { total: number; end: string | null; weeks: number[][] };

export const github = data as {
  generated: string;
  user: string;
  org: string;
  repos: Repo[];
  commits: number;
  languages: { name: string; share: number }[];
  calendar: Calendar | null;
};

/** A product's live numbers, found by its repository's URL. */
export const statsFor = (url: string) => github.repos.find((r) => r.url.toLowerCase() === url.toLowerCase());

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-16" as "16 Nov 2026": absolute, so it never goes stale. */
export function day(iso: string | null | undefined) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

/** The build's year, for the poster's stacked figures. */
export const year = String(new Date(github.generated).getUTCFullYear());
