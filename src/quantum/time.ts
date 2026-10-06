import { skills, worlds, type World } from "@/app/content";
import { current, tree } from "./branches";
import { flags } from "./flags";
import { createStore } from "./store";

// Time travel: the page as it might have looked in the year each skill
// first appeared. A year belongs to a world (content.ts), and each world
// but today's is a stylesheet in public/eras/, loaded the first time it's
// needed and scoped to <html data-era>, so loading one changes nothing
// until the attribute is set. <html data-year> lets a world change a
// little from one stop to the next. The year is part of the branch, so
// back and forward travel too; this follows the current branch.

export type Stop = { year: number; skills: string[]; world: World };

/** One stop per year a skill first appeared, oldest first. */
export const stops: Stop[] = [...new Set(skills.flatMap((g) => g.items.map((i) => i.year)))]
  .sort((a, b) => a - b)
  .map((year) => ({
    year,
    skills: skills.flatMap((g) => g.items.filter((i) => i.year === year).map((i) => i.id)),
    world: worldOf(year),
  }));

export function worldOf(year: number | null): World {
  if (year === null) return "now";
  return worlds.findLast((w) => w.from <= year)?.id ?? "now";
}

/** The year the page is shown in, or null for today. Today's world has
 *  stops of its own (2022), but travelling to one comes back to null. */
export const era = createStore<number | null>(null);

// The early script in <head> (document.ts) reads this on a full page
// load that doesn't come from a history entry, such as a language switch.
const key = "vx-era";

export function remember(year: number | null) {
  try {
    sessionStorage.setItem(key, JSON.stringify(year));
  } catch {}
}

/** The era the tab was last in, which the early script has shown. */
export function remembered(): number | null {
  try {
    const year = JSON.parse(sessionStorage.getItem(key) ?? "null");
    return typeof year === "number" ? year : null;
  } catch {
    return null;
  }
}

const ready = new Set<World>(["now"]);
const loading = new Map<World, Promise<void>>();

/** Loads a world's stylesheet, once. Resolves when it has loaded, or
 *  failed to: a page without it is still the page. */
export function load(world: World): Promise<void> {
  if (ready.has(world)) return Promise.resolve();
  let promise = loading.get(world);
  if (!promise) {
    promise = new Promise<void>((resolve) => {
      // The early script may have added it already.
      let link = document.querySelector<HTMLLinkElement>(`link[data-world="${world}"]`);
      if (link?.sheet) return resolve();
      if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `/eras/${world}.css`;
        link.dataset.world = world;
        document.head.append(link);
      }
      link.addEventListener("load", () => resolve(), { once: true });
      link.addEventListener("error", () => resolve(), { once: true });
    }).then(() => {
      ready.add(world);
    });
    loading.set(world, promise);
  }
  return promise;
}

let chrome: string | null = null;
// The year last applied; undefined until the first.
let shown: number | null | undefined;

function apply(year: number | null) {
  shown = year;
  const root = document.documentElement;
  const world = worldOf(year);
  const now = world === "now";
  if (now) {
    root.removeAttribute("data-era");
    root.removeAttribute("data-year");
  } else {
    root.dataset.era = world;
    root.dataset.year = String(year);
  }
  // Skills that hadn't appeared yet, and the ones that just did, so a
  // world can tell them apart.
  for (const el of document.querySelectorAll<HTMLElement>("[data-skill-year]")) {
    const since = Number(el.dataset.skillYear);
    el.toggleAttribute("data-future", !now && year !== null && since > year);
    el.toggleAttribute("data-new", !now && since === year);
  }
  // The browser's toolbar follows the page's background colour (the
  // token: some worlds paint the page itself with a pattern).
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    chrome ??= meta.content;
    meta.content = now ? chrome : getComputedStyle(root).getPropertyValue("--background").trim() || chrome;
  }
  remember(now ? null : year);
  era.set(now ? null : year);
}

/** The year the current branch should be seen in. */
function target(): number | null {
  if (!flags.get().time) return null;
  const year = current()?.year ?? null;
  return worldOf(year) === "now" ? null : year;
}

// Applies at once when the world is loaded, which travel() makes sure
// of before a transition, so the change lands inside it. Otherwise (back
// and forward, or the map) it applies as soon as the world arrives.
function follow() {
  const year = target();
  if (year === shown) return;
  const world = worldOf(year);
  if (ready.has(world)) apply(year);
  else load(world).then(follow);
}

/** Starts following the current branch's year. Returns the cleanup. */
export function startTime() {
  follow();
  const stopTree = tree.subscribe(follow);
  const stopFlags = flags.subscribe(follow);
  return () => {
    stopTree();
    stopFlags();
  };
}

/** Keeps what's on screen in place while a world changes the layout
 *  around it: notes how far into its view the top of the screen is, and
 *  returns a function that scrolls back to the same point. */
export function anchor(): () => void {
  // At the very top, stay there, whatever the new world's header adds.
  if (window.scrollY < 1) return () => window.scrollTo({ top: 0, behavior: "instant" });
  const line = (document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0) + 1;
  const views = [...document.querySelectorAll<HTMLElement>("[data-branch-view]")];
  const view = views.findLast((v) => v.getBoundingClientRect().top <= line) ?? views[0];
  if (!view) return () => {};
  const box = view.getBoundingClientRect();
  const into = box.height ? (line - box.top) / box.height : 0;
  return () => {
    const next = view.getBoundingClientRect();
    const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    window.scrollBy({ top: next.top + into * next.height - (header + 1), behavior: "instant" });
  };
}
