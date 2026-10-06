import { createStore } from "./store";

// The effects, each of which can be turned off in the Effects panel. They
// all start on. The choice is saved in this browser, and ?quantum=off or
// ?quantum=on in the URL turns them all off or back on.
export const effects = ["ghosts", "tunneling"] as const;
export type Effect = (typeof effects)[number];
export type Flags = Record<Effect, boolean>;

const key = "vx-quantum";
const allOn = Object.fromEntries(effects.map((e) => [e, true])) as Flags;
const allOff = Object.fromEntries(effects.map((e) => [e, false])) as Flags;

export const flags = createStore<Flags>(allOn);

// Whether the system asks for less motion. Effects stay available but
// keep still: no flicker, no loops, and transitions become a short fade.
export const reducedMotion = createStore(false);

function save(next: Flags) {
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Storage can be off (private windows, blocked site data); the
    // choice then lasts for this page only.
  }
}

// CSS reads the flags from <html data-q-…> attributes, so effects drawn
// in CSS alone can follow them too.
function reflect(next: Flags) {
  for (const e of effects) document.documentElement.toggleAttribute(`data-q-${e}`, next[e]);
}

export function setFlags(next: Flags) {
  flags.set(next);
  save(next);
  reflect(next);
}

export function setFlag(effect: Effect, on: boolean) {
  setFlags({ ...flags.get(), [effect]: on });
}

export function setAll(on: boolean) {
  setFlags(on ? allOn : allOff);
}

/** Reads the saved choice and the URL once, in the browser. */
export function loadFlags() {
  let saved: Partial<Record<string, unknown>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) ?? "{}") ?? {};
  } catch {}
  const next = { ...allOn };
  for (const e of effects) if (typeof saved[e] === "boolean") next[e] = saved[e] as boolean;

  const param = new URLSearchParams(location.search).get("quantum");
  if (param === "off") return setAll(false);
  if (param === "on") return setAll(true);
  flags.set(next);
  reflect(next);

  const query = matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.set(query.matches);
  query.addEventListener("change", () => reducedMotion.set(query.matches));
}
