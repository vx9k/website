#!/usr/bin/env node
// Refreshes src/data/github.json from the GitHub API: the same listing as
// the profile README's (github.com/vx9k/vx9k, scripts/update_projects.py),
// so the site and the profile say the same thing.
//
//   * every public, non-fork repo owned by USER, and every public repo in
//     ORG that USER has commits in, with stars, USER's commits, language,
//     last push and latest release;
//   * the languages across those repos, by bytes of code;
//   * USER's contribution calendar for the last year (GraphQL; it needs a
//     token, and without one the previous calendar is kept).
//
// The "generated" date only changes when the data does, so a scheduled run
// with nothing new writes nothing and the workflow commits nothing.
// .github/workflows/github-data.yml runs it daily; a push to main then
// redeploys the site through Workers Builds. Node's standard library only.
// Reads GITHUB_TOKEN (or GH_TOKEN) if set.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const USER = "vx9k";
const ORG = "poopware-laboratories";
const OUT = fileURLToPath(new URL("../src/data/github.json", import.meta.url));

// Never listed: the profile repo, the org's metadata, and vx's configs
// (vx doesn't want the dotfiles showcased).
const EXCLUDE = new Set([`${USER}/${USER}`, `${ORG}/.github`, `${USER}/dots`, `${USER}/nvim`]);
const LANG_COUNT = 8;

const API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${USER}-website`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(API + path, { headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}
  return { status: res.status, data };
}

async function getAll(path) {
  const out = [];
  const sep = path.includes("?") ? "&" : "?";
  for (let page = 1; ; page++) {
    const { status, data } = await get(`${path}${sep}per_page=100&page=${page}`);
    if (status !== 200) throw new Error(`GET ${path}: HTTP ${status}: ${JSON.stringify(data)}`);
    out.push(...data);
    if (data.length < 100) return out;
  }
}

// USER's commits in a repo; for forks, only those ahead of upstream.
async function myCommits(repo) {
  const name = repo.full_name;
  if (repo.fork) {
    const { status, data: full } = await get(`/repos/${name}`);
    const parent = full?.parent;
    if (status !== 200 || !parent) return 0;
    const cmp = await get(`/repos/${parent.full_name}/compare/${parent.default_branch}...${repo.owner.login}:${repo.default_branch}`);
    if (cmp.status !== 200) return 0;
    return (cmp.data.commits ?? []).filter((c) => c.author?.login === USER).length;
  }
  const { status, data } = await get(`/repos/${name}/contributors?per_page=100`);
  if (status === 200 && Array.isArray(data)) return data.find((c) => c.login === USER)?.contributions ?? 0;
  // 204: empty repo. 403: history too large to list; probe instead.
  const probe = await get(`/repos/${name}/commits?author=${USER}&per_page=1`);
  return probe.status === 200 && probe.data?.length ? 1 : 0;
}

async function latestRelease(name) {
  const { status, data } = await get(`/repos/${name}/releases/latest`);
  if (status !== 200 || !data) return null;
  return { tag: data.tag_name, date: data.published_at?.slice(0, 10) ?? null, url: data.html_url };
}

async function collect() {
  const own = (await getAll(`/users/${USER}/repos?type=owner`)).map((r) => ({ ...r, from: "own" }));
  const org = (await getAll(`/orgs/${ORG}/repos?type=public`)).map((r) => ({ ...r, from: "org" }));
  const kept = [];
  for (const r of [...org, ...own]) {
    if (r.private || EXCLUDE.has(r.full_name)) continue;
    const commits = await myCommits(r);
    if (!commits) continue;
    kept.push({
      repo: r.full_name,
      name: r.name,
      from: r.from,
      url: r.html_url,
      description: r.description ?? null,
      language: r.language ?? null,
      stars: r.stargazers_count,
      commits,
      pushed: r.pushed_at?.slice(0, 10) ?? null,
      fork: r.fork,
      release: await latestRelease(r.full_name),
    });
  }
  return kept.sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
}

async function languages(repos) {
  const totals = new Map();
  for (const r of repos) {
    const { status, data } = await get(`/repos/${r.repo}/languages`);
    if (status !== 200 || !data) continue;
    for (const [lang, n] of Object.entries(data)) totals.set(lang, (totals.get(lang) ?? 0) + n);
  }
  const whole = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return [...totals]
    .sort((a, b) => b[1] - a[1])
    .slice(0, LANG_COUNT)
    .map(([name, n]) => ({ name, share: Math.round((1000 * n) / whole) / 10 }));
}

// The contribution calendar: each week a column of seven days, each day
// GitHub's own level from 0 (none) to 4 (most).
const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
async function calendar() {
  if (!TOKEN) return null;
  const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
    totalContributions weeks { contributionDays { contributionLevel date } } } } } }`;
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) return null;
  const cal = (await res.json())?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions,
    end: cal.weeks.at(-1)?.contributionDays.at(-1)?.date ?? null,
    weeks: cal.weeks.map((w) => w.contributionDays.map((d) => LEVELS[d.contributionLevel] ?? 0)),
  };
}

const previous = JSON.parse(await readFile(OUT, "utf8").catch(() => "null"));
const repos = await collect();
const data = {
  user: USER,
  org: ORG,
  repos,
  commits: repos.reduce((n, r) => n + r.commits, 0),
  languages: await languages(repos),
  calendar: (await calendar()) ?? previous?.calendar ?? null,
};

const strip = (d) => JSON.stringify({ ...d, generated: undefined });
if (previous && strip(previous) === strip(data)) {
  console.log("github.json unchanged");
} else {
  const generated = new Date().toISOString().slice(0, 10);
  await writeFile(OUT, JSON.stringify({ generated, ...data }, null, 2) + "\n");
  console.log(`github.json updated: ${repos.length} repos, ${data.commits} commits`);
}
