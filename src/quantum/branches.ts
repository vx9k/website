import { sections } from "@/app/content";
import { hasLocale, type Locale } from "@/app/i18n/locales";
import { createStore } from "./store";

// Many-worlds navigation: every visit is a branch, a place on the site
// and the year it's seen in (see time.ts), plus the choice that led
// there. Taking a different path from the same place splits off a new
// branch; taking the same one again re-enters the branch that's already
// there. The tree lives in sessionStorage, so it lasts as long as the tab
// and survives the full page loads of a language switch. Back and forward
// don't branch: they move along the tree, by the branch id stored on each
// history entry (see navigate.ts).

export type Place = "top" | (typeof sections)[number];
export const places: readonly Place[] = ["top", ...sections];

export type Choice = "start" | "nav" | "lang" | "map" | "link" | "time";

export type Branch = {
  id: string;
  parent: string | null;
  lang: Locale;
  place: Place;
  /** The year the page is seen in, or null for today. */
  year: number | null;
  choice: Choice;
  /** When the branch was first taken, for ordering siblings. */
  at: number;
};

export type Tree = { nodes: Branch[]; current: string | null };

const key = "vx-branches";
const pendingKey = "vx-branch-pending";
// Enough for a long visit; past it the oldest dead ends are dropped.
const limit = 48;

export const tree = createStore<Tree>({ nodes: [], current: null });

export function placeOf(hash: string): Place | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (id === "" || id === "top") return "top";
  return (sections as readonly string[]).includes(id) ? (id as Place) : null;
}

export function langOf(pathname: string): Locale | null {
  const segment = pathname.split("/")[1] ?? "";
  return hasLocale(segment) && /^\/[a-z]+\/?$/.test(pathname) ? segment : null;
}

export const hrefOf = (b: Pick<Branch, "lang" | "place">) =>
  b.place === "top" ? `/${b.lang}` : `/${b.lang}#${b.place}`;

export const find = (id: string | null | undefined) =>
  id ? tree.get().nodes.find((n) => n.id === id) : undefined;

export const current = () => find(tree.get().current);

export const visited = (lang: Locale, place: Place) =>
  tree.get().nodes.some((n) => n.lang === lang && n.place === place);

/** The branch and its ancestors, from the root down. */
export function lineage(id: string): Branch[] {
  const line: Branch[] = [];
  for (let node = find(id); node; node = find(node.parent)) line.unshift(node);
  return line;
}

function save(next: Tree) {
  tree.set(next);
  try {
    sessionStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Without storage the tree lasts for this page only.
  }
}

function newId() {
  const words = crypto.getRandomValues(new Uint32Array(2));
  return words[0].toString(36) + words[1].toString(36);
}

// Drops the oldest leaves that aren't on the way to the current branch
// until the tree fits.
function prune(nodes: Branch[], keep: string) {
  const path = new Set(lineage(keep).map((n) => n.id));
  const out = [...nodes];
  while (out.length > limit) {
    const parents = new Set(out.map((n) => n.parent));
    const leaf = out.filter((n) => !parents.has(n.id) && !path.has(n.id)).sort((a, b) => a.at - b.at)[0];
    if (!leaf) break;
    out.splice(out.indexOf(leaf), 1);
  }
  return out;
}

export function moveTo(id: string) {
  if (!find(id)) return;
  save({ ...tree.get(), current: id });
}

/** Takes a path from a branch (the current one by default): re-enters the
 *  child that made the same choice to the same place and year, or splits
 *  off a new one, and makes it current. The year carries over unless the
 *  choice was to travel. */
export function branch(
  lang: Locale,
  place: Place,
  choice: Choice,
  from = tree.get().current,
  year = find(from)?.year ?? null,
): Branch {
  const { nodes } = tree.get();
  const existing = nodes.find(
    (n) => n.parent === from && n.lang === lang && n.place === place && n.choice === choice && n.year === year,
  );
  if (existing) {
    moveTo(existing.id);
    return existing;
  }
  const parent = from && find(from) ? from : null;
  const node: Branch = { id: newId(), parent, lang, place, year, choice, at: Date.now() };
  save({ nodes: prune([...nodes, node], node.id), current: node.id });
  return node;
}

export function loadTree() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
    // Trees saved before time travel have no years: they were today.
    if (saved && Array.isArray(saved.nodes))
      tree.set({ ...saved, nodes: saved.nodes.map((n: Branch) => ({ ...n, year: n.year ?? null })) });
  } catch {}
}

// A full page load (a language switch, or a map jump to another language)
// can't carry the branch in memory, so the page that leaves writes down
// where it came from and the page that arrives reads it once.
export type Pending = { from: string; choice: Choice } | { jump: string };

export function setPending(pending: Pending) {
  try {
    sessionStorage.setItem(pendingKey, JSON.stringify(pending));
  } catch {}
}

export function takePending(): Pending | null {
  try {
    const raw = sessionStorage.getItem(pendingKey);
    sessionStorage.removeItem(pendingKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
