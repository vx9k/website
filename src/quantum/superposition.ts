import { seeded } from "./seed";

// Superposition: each link in the header sits in a few faint places at
// once (text shadows in globals.css) and collapses into one as the pointer
// comes near. This only measures: on each pointer move, at most once a
// frame, it sets --q on every link, 1 far away and 0 on top of it. Nothing
// runs while the pointer is still.
//
// Touch has no pointer to come near, so on a touch screen the first tap
// on a link collapses it and the second, while it's collapsed, follows it.
// Keyboard activation and every other pointer go straight through.

const near = 12;
const far = 180;
// How long a tapped link stays collapsed, waiting for the second tap.
const held = 4000;

const items = () => [...document.querySelectorAll<HTMLElement>(".site-header :is(nav a, [data-panel])")];

/** Starts the effect. Returns the cleanup. */
export function startSuperposition() {
  const root = document.documentElement;
  // Each link's copies lie at their own angle.
  for (const item of items()) {
    item.style.setProperty("--a", `${Math.round(seeded(item.getAttribute("href") ?? item.dataset.panel ?? "")() * 360)}deg`);
  }

  let x = 0;
  let y = 0;
  let frame = 0;
  let touch = false;
  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

  function measure() {
    frame = 0;
    for (const item of items()) {
      const box = item.getBoundingClientRect();
      // Distance from the pointer to the nearest point of the link's box.
      const dx = Math.max(box.left - x, 0, x - box.right);
      const dy = Math.max(box.top - y, 0, y - box.bottom);
      const q = Math.min(1, Math.max(0, (Math.hypot(dx, dy) - near) / (far - near)));
      item.style.setProperty("--q", q.toFixed(2));
    }
  }

  function onMove(event: PointerEvent) {
    touch = event.pointerType === "touch";
    if (touch) return;
    x = event.clientX;
    y = event.clientY;
    frame ||= requestAnimationFrame(measure);
  }

  // The pointer left the window: everything spreads out again.
  function onOut(event: PointerEvent) {
    if (event.relatedTarget) return;
    for (const item of items()) item.style.removeProperty("--q");
  }

  function onDown(event: PointerEvent) {
    touch = event.pointerType === "touch";
  }

  // Runs before the page's own click handlers (capture, on the window),
  // so a first tap that only collapses a link goes no further.
  function onClick(event: MouseEvent) {
    if (!touch || event.detail === 0) return;
    const link = (event.target as Element | null)?.closest?.<HTMLElement>(".site-header nav a");
    if (!link) return;
    if (link.hasAttribute("data-collapsed")) return;
    if (matchMedia("(forced-colors: active)").matches) return;
    event.preventDefault();
    event.stopPropagation();
    for (const [other, timer] of timers) {
      clearTimeout(timer);
      other.removeAttribute("data-collapsed");
    }
    timers.clear();
    link.setAttribute("data-collapsed", "");
    timers.set(
      link,
      setTimeout(() => {
        link.removeAttribute("data-collapsed");
        timers.delete(link);
      }, held),
    );
  }

  root.setAttribute("data-superposed", "");
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerout", onOut);
  window.addEventListener("click", onClick, true);
  return () => {
    root.removeAttribute("data-superposed");
    cancelAnimationFrame(frame);
    for (const [item, timer] of timers) {
      clearTimeout(timer);
      item.removeAttribute("data-collapsed");
    }
    for (const item of items()) {
      item.style.removeProperty("--q");
      item.style.removeProperty("--a");
    }
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerout", onOut);
    window.removeEventListener("click", onClick, true);
  };
}
