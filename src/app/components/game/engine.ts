// A tiny platformer physics engine. Everything is in document pixels,
// y pointing down. Bodies are axis-aligned boxes under gravity; platforms
// are one-way ledges (solid from above, passable from below and the
// sides), which is how the page's own headings, buttons and rules become
// floors without trapping anyone underneath them.

export type Platform = {
  x: number;
  y: number;
  w: number;
  /** The page element the ledge came from, so landing on it can bump it. */
  el: Element | null;
};

export type Body = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  /** Bounciness on landing: 0 stops dead, 1 keeps all its speed. */
  bounce: number;
  grounded: boolean;
  on: Platform | null;
};

export type Landing = { platform: Platform; speed: number };

export const GRAVITY = 2100; // px/s²
const TERMINAL = 1500; // px/s

export function body(x: number, y: number, w: number, h: number, bounce = 0): Body {
  return { x, y, w, h, vx: 0, vy: 0, bounce, grounded: false, on: null };
}

/** Advances a body by dt seconds and resolves landings. `ignore` is a
 *  platform the body is dropping through. Returns the landing, if any. */
export function step(
  b: Body,
  dt: number,
  platforms: Platform[],
  world: { width: number; height: number },
  ignore: Platform | null = null,
): Landing | null {
  const prevBottom = b.y + b.h;
  b.vy = Math.min(b.vy + GRAVITY * dt, TERMINAL);
  b.x += b.vx * dt;
  b.y += b.vy * dt;

  // Walls at the edges of the page.
  if (b.x < 0) {
    b.x = 0;
    b.vx = -b.vx * b.bounce;
  } else if (b.x + b.w > world.width) {
    b.x = world.width - b.w;
    b.vx = -b.vx * b.bounce;
  }

  b.grounded = false;
  b.on = null;
  if (b.vy < 0) return null;

  // The highest ledge the body's feet crossed during this step.
  const bottom = b.y + b.h;
  let hit: Platform | null = null;
  for (const p of platforms) {
    if (p === ignore) continue;
    if (b.x + b.w <= p.x + 2 || b.x >= p.x + p.w - 2) continue;
    if (prevBottom <= p.y + 1 && bottom >= p.y && (!hit || p.y < hit.y)) hit = p;
  }
  // The bottom of the page is a floor too.
  if (!hit && bottom >= world.height) {
    hit = { x: 0, y: world.height, w: world.width, el: null };
  }
  if (!hit) return null;

  const speed = b.vy;
  b.y = hit.y - b.h;
  if (b.bounce > 0 && speed > 180) {
    b.vy = -speed * b.bounce;
  } else {
    b.vy = 0;
    b.grounded = true;
    b.on = hit;
  }
  return { platform: hit, speed };
}

export function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Short-lived squares thrown out by landings, kicks and pickups. They
 *  fall under the same gravity but don't collide with anything. */
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number };

export function burst(
  into: Particle[],
  x: number,
  y: number,
  count: number,
  { speed = 220, lift = 260, life = 0.6, size = 3 } = {},
) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI - Math.PI; // upwards half-circle
    const v = speed * (0.4 + Math.random() * 0.6);
    into.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - lift * Math.random(),
      life: life * (0.6 + Math.random() * 0.4),
      size,
    });
  }
}

export function stepParticles(ps: Particle[], dt: number) {
  for (const p of ps) {
    p.vy += GRAVITY * 0.6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  }
  for (let i = ps.length - 1; i >= 0; i--) if (ps[i].life <= 0) ps.splice(i, 1);
}
