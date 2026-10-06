import type { Locale } from "@/app/i18n/locales";
import {
  branch,
  current,
  find,
  hrefOf,
  langOf,
  loadTree,
  moveTo,
  placeOf,
  setPending,
  takePending,
  tree,
  type Branch,
  type Choice,
  type Place,
} from "./branches";
import { flags } from "./flags";

// Hooks the branch tree into the browser's own navigation. Links stay real
// links: the section links and "vx" are handled in the page (a branch, a
// history entry, a transition), the language links still load the other
// copy of the site, and back/forward move along the tree.
//
// Next.js patches history.pushState/replaceState and reloads the page on
// a popstate whose entry has state but not its own __NA marker. So every
// entry this writes keeps Next's fields: pushState goes through Next's
// patch, which copies them from the current entry and keeps any custom
// state, and tag() adds them when the entry came from the browser itself.

type HistoryState = Record<string, unknown> & { vxBranch?: string };

let lang: Locale;
let nextFields: HistoryState = {};

function tag(id: string) {
  const state = (history.state ?? {}) as HistoryState;
  history.replaceState({ ...(state.__NA ? {} : nextFields), ...state, vxBranch: id }, "");
}

function target(place: Place): HTMLElement | null {
  return place === "top" ? document.getElementById("main") : document.getElementById(place);
}

// Inside a transition it jumps straight there: a smooth scroll would still
// be moving when the transition takes its picture of the new view. Outside
// one, "auto" leaves it to the page's scroll-behavior, which is smooth
// unless the system asks for less motion.
function show(place: Place, behavior: ScrollBehavior = "auto") {
  if (place === "top") window.scrollTo({ top: 0, behavior });
  else target(place)?.scrollIntoView({ block: "start", behavior });
}

// A keyboard user lands inside the section, as a native anchor would leave
// them; a pointer user's focus stays put.
function focus(place: Place) {
  const el = target(place);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

// Tunneling: the old view leaks through a barrier while the new one
// resolves behind it (globals.css). Without the View Transitions API, or
// with the effect off, the page scrolls there as it always has.
function transition(update: (animated: boolean) => void): Promise<void> {
  if (!flags.get().tunneling || !document.startViewTransition) {
    update(false);
    return Promise.resolve();
  }
  return document.startViewTransition(() => update(true)).finished.catch(() => {});
}

// The branch is taken inside the update, so the transition's picture of
// the old view still has the old branch's ghosts.
function go(take: () => Branch, keyboard: boolean) {
  let place: Place = "top";
  transition((animated) => {
    const node = take();
    place = node.place;
    history.pushState({ vxBranch: node.id }, "", place === "top" ? location.pathname : `#${place}`);
    show(place, animated ? "instant" : "auto");
  }).then(() => keyboard && focus(place));
}

/** Follows a choice from the current branch to a place on this page. */
export function navigate(place: Place, choice: Choice, keyboard = false) {
  const here = current();
  if (here && here.lang === lang && here.place === place) {
    show(place);
    return;
  }
  go(() => branch(lang, place, choice), keyboard);
}

/** Moves to a branch that already exists, from the branch map. */
export function jump(id: string, keyboard = false) {
  const node = find(id);
  if (!node) return;
  if (node.lang !== lang) {
    setPending({ jump: id });
    location.assign(hrefOf(node));
    return;
  }
  go(() => {
    moveTo(id);
    return node;
  }, keyboard);
}

function onClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;
  const url = new URL(link.href);
  const to = langOf(url.pathname);
  if (url.origin !== location.origin || !to) return;

  const here = current();
  if (to !== lang) {
    // Another copy of the site: a full load, which picks up this branch.
    if (here) setPending({ from: here.id, choice: "lang" });
    return;
  }
  const place = placeOf(url.hash);
  if (!place || url.search !== location.search) return; // the skip link and the like stay native
  event.preventDefault();
  navigate(place, "nav", event.detail === 0);
}

// Back and forward: the entry says which branch it was.
function onPopState(event: PopStateEvent) {
  const id = (event.state as HistoryState | null)?.vxBranch;
  if (find(id)) moveTo(id!);
}

// A hash the page didn't set itself (typed into the address bar, or a
// native anchor this didn't handle) is a new path from here.
function onHashChange() {
  const id = (history.state as HistoryState | null)?.vxBranch;
  if (find(id)) {
    if (tree.get().current !== id) moveTo(id!);
    return;
  }
  const place = placeOf(location.hash);
  if (!place) return;
  tag(branch(lang, place, "link").id);
}

// Leaving for another copy of the site: the transition is drawn by CSS
// (@view-transition in globals.css), so this only cancels it when the
// effect is off.
function onPageSwap(event: Event) {
  const transition = (event as Event & { viewTransition?: ViewTransition | null }).viewTransition;
  if (transition && !flags.get().tunneling) transition.skipTransition();
}

/** Places this page in the tree and starts listening. Returns the cleanup. */
export function startNavigation(pageLang: Locale) {
  lang = pageLang;
  const state = (history.state ?? {}) as HistoryState;
  if (state.__NA) {
    nextFields = { __NA: state.__NA, __PRIVATE_NEXTJS_INTERNALS_TREE: state.__PRIVATE_NEXTJS_INTERNALS_TREE };
  }
  loadTree();

  const place = placeOf(location.hash) ?? "top";
  // A reload, or back/forward from another page: the entry knows its branch.
  let node = find(state.vxBranch);
  if (node && (node.lang !== lang || node.place !== place)) node = undefined;
  if (!node) {
    const pending = takePending();
    if (pending && "jump" in pending && find(pending.jump)) {
      node = find(pending.jump);
      moveTo(pending.jump);
    } else if (pending && "from" in pending && find(pending.from)) {
      node = branch(lang, place, pending.choice, pending.from);
    }
  }
  node ??= branch(lang, place, tree.get().nodes.length ? "link" : "start");
  moveTo(node.id);
  tag(node.id);

  document.addEventListener("click", onClick);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("pageswap", onPageSwap);
  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("popstate", onPopState);
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("pageswap", onPageSwap);
  };
}
