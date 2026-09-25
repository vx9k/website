"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { REQUEST, STATE, type Request } from "./control";
import {
  body,
  burst,
  overlaps,
  step,
  stepParticles,
  type Body,
  type Particle,
  type Platform,
} from "./engine";
import { BALL, GEM, Hero, HERO_H, HERO_W, Still, type Frame } from "./Sprite";

export type GameText = {
  play: string;
  stop: string;
  character: string;
  region: string;
  help: string;
  helpTouch: string;
  /** "{n}" and "{total}" are filled in. */
  found: string;
  allFound: string;
  pad: { left: string; right: string; up: string; down: string; a: string; b: string };
};

type Input = { left: boolean; right: boolean; down: boolean; jump: boolean; poke: boolean };
// Presses are latched as well as held, so a tap shorter than a frame
// still jumps (or pokes) on the next step.
type Presses = { jump: boolean; poke: boolean };
type Gem = { el: Element; dx: number; dy: number; x: number; y: number; taken: boolean };

const SCALE = 3; // screen pixels per art pixel
const HW = HERO_W * SCALE;
const HH = HERO_H * SCALE;
const BALL_SIZE = BALL.length * SCALE;
const GEM_SIZE = GEM.length * SCALE;
const MAX_GEMS = 10;
const POOL = 48; // particle elements

const RUN = 230; // px/s
const ACCEL_GROUND = 2600;
const ACCEL_AIR = 1500;
const JUMP = 640;
const DOUBLE_JUMP = 560;
const COYOTE = 0.09; // s after leaving a ledge that a jump still counts
const BUFFER = 0.12; // s before landing that a jump press is remembered
const DROP = 0.28; // s a dropped-through ledge is ignored

const KEYS: Record<string, keyof Input | "stop"> = {
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowUp: "jump",
  w: "jump",
  W: "jump",
  " ": "jump",
  ArrowDown: "down",
  s: "down",
  S: "down",
  x: "poke",
  X: "poke",
  e: "poke",
  E: "poke",
  Enter: "poke",
  Escape: "stop",
};

// The page's floors: every line of a heading, buttons, chips, dialogue
// boxes, dashed rules, the stairs, and the ground under the mountains.
function collectPlatforms(): Platform[] {
  const out: Platform[] = [];
  const sx = window.scrollX;
  const sy = window.scrollY;
  const add = (r: DOMRect, el: Element, y = r.top) => {
    if (r.width < 12 || r.height === 0) return;
    out.push({ x: r.left + sx, y: y + sy, w: r.width, el });
  };
  document.querySelectorAll("main h1, main h2, main h3").forEach((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    // Merge the inline boxes of each visual line into one ledge.
    const lines: DOMRect[] = [];
    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 4) continue;
      const line = lines.find((l) => Math.abs(l.top - r.top) < 6);
      if (line) {
        const left = Math.min(line.left, r.left);
        const right = Math.max(line.right, r.right);
        line.x = left;
        line.width = right - left;
      } else lines.push(DOMRect.fromRect(r));
    }
    lines.forEach((r) => add(r, el));
  });
  document
    .querySelectorAll(".btn, .chip, .dialog, [data-solid], .rule-t")
    .forEach((el) => add(el.getBoundingClientRect(), el));
  document.querySelectorAll(".rule-b").forEach((el) => {
    const r = el.getBoundingClientRect();
    add(r, el, r.bottom - 3);
  });
  const scene = document.querySelector("main .scene");
  if (scene) {
    const r = scene.getBoundingClientRect();
    add(r, scene, r.bottom - 1);
  }
  return out;
}

// Gems sit above a spread of ledges down the page, anchored to the
// element they float over so they follow it if the layout shifts.
function placeGems(platforms: Platform[]): Gem[] {
  const gems: Gem[] = [];
  const sorted = platforms
    .filter((p) => p.w >= 60 && p.el?.closest("main"))
    .sort((a, b) => a.y - b.y);
  let lastY = -Infinity;
  for (const p of sorted) {
    if (gems.length >= MAX_GEMS) break;
    if (p.y - lastY < 260) continue;
    lastY = p.y;
    const r = p.el!.getBoundingClientRect();
    const x = p.x + p.w * (0.3 + ((gems.length * 37) % 40) / 100);
    const y = p.y - GEM_SIZE - 26;
    gems.push({
      el: p.el!,
      dx: x - (r.left + window.scrollX),
      dy: y - (r.top + window.scrollY),
      x,
      y,
      taken: false,
    });
  }
  return gems;
}

function calm() {
  return document.documentElement.hasAttribute("data-motion");
}

/** The playable page: a character, a ball and gems in a layer over the
 *  document, stepped by engine.ts, with the page's own elements as floors.
 *  Arrow keys (or WASD) only belong to the game while it's running. */
export default function Game({ text }: { text: GameText }) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState({ n: 0, total: 0 });
  const [touch, setTouch] = useState(false);
  const input = useRef<Input>({ left: false, right: false, down: false, jump: false, poke: false });
  const presses = useRef<Presses>({ jump: false, poke: false });
  const layer = useRef<HTMLDivElement>(null);
  const heroEl = useRef<HTMLDivElement>(null);
  const ballEl = useRef<HTMLDivElement>(null);
  const gemEls = useRef<(HTMLDivElement | null)[]>([]);
  const particleEls = useRef<(HTMLSpanElement | null)[]>([]);
  const status = useRef<HTMLDivElement>(null);
  const [gemCount, setGemCount] = useState(0);

  // Start and stop on request from any Play button.
  useEffect(() => {
    const onRequest = (e: Event) => {
      const action = (e as CustomEvent<Request>).detail;
      setPlaying((p) => (action === "toggle" ? !p : action === "start"));
    };
    window.addEventListener(REQUEST, onRequest);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    return () => window.removeEventListener(REQUEST, onRequest);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (playing) root.setAttribute("data-playing", "");
    else root.removeAttribute("data-playing");
    window.dispatchEvent(new CustomEvent(STATE, { detail: playing }));
  }, [playing]);

  // The game loop, alive only while playing.
  useEffect(() => {
    if (!playing) return;
    const keys = input.current;
    const pressed = presses.current;
    const world = { width: 0, height: 0 };
    let platforms: Platform[] = [];

    const measure = () => {
      world.width = document.documentElement.clientWidth;
      world.height = document.documentElement.scrollHeight;
      platforms = collectPlatforms();
    };
    measure();

    // Spawn where the idle character stands in the scene if it's on
    // screen, otherwise drop in from the top of the view.
    const spawn = document.querySelector("[data-hero-spawn]")?.getBoundingClientRect();
    const onScreen = spawn && spawn.bottom > 0 && spawn.top < window.innerHeight;
    const hero: Body = onScreen
      ? body(spawn.left + window.scrollX, spawn.bottom + window.scrollY - HH, HW, HH)
      : body(world.width * 0.3, window.scrollY + 40, HW, HH);
    const ball = body(hero.x + 90, hero.y - 60, BALL_SIZE, BALL_SIZE, 0.55);
    const gems = placeGems(platforms);
    const particles: Particle[] = [];
    setGemCount(gems.length);
    setScore({ n: 0, total: gems.length });

    let facing = 1;
    let jumpsLeft = 2;
    let sinceGround = 0;
    let jumpBuffer = 0;
    let dropping: Platform | null = null;
    let dropTimer = 0;
    let animTime = 0;
    let blinkIn = 2.5;
    let taken = 0;
    let last = performance.now();
    let sinceMeasure = 0;
    let raf = 0;

    const bump = (el: Element | null) => {
      if (!el || calm() || !(el instanceof HTMLElement)) return;
      el.animate(
        [{ transform: "translateY(0)" }, { transform: `translateY(${SCALE}px)` }, { transform: "translateY(0)" }],
        { duration: 180, easing: "steps(3)" },
      );
    };

    const poke = () => {
      const reach = { x: hero.x - 24, y: hero.y - 48, w: hero.w + 48, h: hero.h + 72 };
      for (const el of document.querySelectorAll<HTMLElement>(".scene-button, [data-poke]")) {
        const r = el.getBoundingClientRect();
        const box = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
        if (overlaps(reach, box)) {
          el.click();
          if (!calm()) burst(particles, hero.x + hero.w / 2, hero.y, 6, { speed: 120, lift: 120 });
          return;
        }
      }
    };

    const tick = (dt: number) => {
      // Horizontal: accelerate towards the held direction, brake otherwise.
      const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      if (dir) facing = dir;
      const accel = (hero.grounded ? ACCEL_GROUND : ACCEL_AIR) * dt;
      const target = dir * RUN;
      if (hero.vx < target) hero.vx = Math.min(target, hero.vx + accel);
      else if (hero.vx > target) hero.vx = Math.max(target, hero.vx - accel);

      // Jumps: coyote time, a buffered press, and one double jump.
      sinceGround = hero.grounded ? 0 : sinceGround + dt;
      if (hero.grounded) jumpsLeft = 2;
      if (pressed.jump) jumpBuffer = BUFFER;
      pressed.jump = false;
      jumpBuffer = Math.max(0, jumpBuffer - dt);
      if (jumpBuffer > 0) {
        if (sinceGround < COYOTE && jumpsLeft === 2) {
          hero.vy = -JUMP;
          jumpsLeft = 1;
          jumpBuffer = 0;
          sinceGround = COYOTE;
        } else if (jumpsLeft > 0 && sinceGround >= COYOTE) {
          hero.vy = -DOUBLE_JUMP;
          jumpsLeft = 0;
          jumpBuffer = 0;
          if (!calm()) burst(particles, hero.x + hero.w / 2, hero.y + hero.h, 5, { speed: 90, lift: 0 });
        }
      }
      // Short hop when the jump key is let go early.
      if (!keys.jump && hero.vy < -260) hero.vy = -260;

      // Down drops through the ledge underfoot.
      dropTimer = Math.max(0, dropTimer - dt);
      if (!dropTimer) dropping = null;
      if (keys.down && hero.grounded && hero.on && hero.on.el) {
        dropping = hero.on;
        dropTimer = DROP;
        hero.grounded = false;
      }

      const landed = step(hero, dt, platforms, world, dropping);
      if (landed && landed.speed > 520) {
        bump(landed.platform.el);
        if (!calm()) burst(particles, hero.x + hero.w / 2, hero.y + hero.h, 6, { speed: 140, lift: 60 });
      }

      // The ball: kicked by running into it, bounced on by landing on it.
      const ballLanded = step(ball, dt, platforms, world);
      if (ball.grounded) ball.vx *= Math.max(0, 1 - 2.5 * dt);
      if (ballLanded && ballLanded.speed > 400) bump(ballLanded.platform.el);
      if (overlaps(hero, ball)) {
        if (hero.vy > 0 && hero.y + hero.h - ball.y < 14) {
          hero.vy = -JUMP * 0.85;
          jumpsLeft = 1;
          ball.vy = 260;
        } else {
          const side = Math.sign(ball.x + ball.w / 2 - (hero.x + hero.w / 2)) || facing;
          ball.vx = side * Math.max(300, Math.abs(hero.vx) * 1.6);
          ball.vy = -380;
          ball.x = side > 0 ? hero.x + hero.w + 1 : hero.x - ball.w - 1;
          if (!calm()) burst(particles, ball.x + ball.w / 2, ball.y + ball.h, 4, { speed: 100, lift: 40 });
        }
      }

      // Gems.
      for (const g of gems) {
        if (g.taken || !overlaps(hero, { x: g.x, y: g.y, w: GEM_SIZE, h: GEM_SIZE })) continue;
        g.taken = true;
        taken++;
        setScore({ n: taken, total: gems.length });
        if (!calm()) burst(particles, g.x + GEM_SIZE / 2, g.y + GEM_SIZE / 2, 12, { speed: 240, lift: 160 });
        if (taken === gems.length && !calm()) {
          burst(particles, hero.x + hero.w / 2, hero.y, 30, { speed: 360, lift: 300, life: 1 });
        }
      }

      if (pressed.poke) poke();
      pressed.poke = false;

      stepParticles(particles, dt);
      animTime += dt;
      blinkIn -= dt;
      if (blinkIn < -0.15) blinkIn = 2 + Math.random() * 3;
    };

    const draw = () => {
      const h = heroEl.current;
      if (h) {
        h.style.transform = `translate(${Math.round(hero.x)}px, ${Math.round(hero.y)}px)`;
        let frame: Frame = "idle";
        if (!hero.grounded) frame = hero.vy < 0 ? "jump" : "fall";
        else if (Math.abs(hero.vx) > 30) frame = Math.floor(animTime / 0.12) % 2 ? "walk1" : "walk2";
        else if (blinkIn < 0) frame = "blink";
        const svg = h.firstElementChild as SVGElement | null;
        if (svg) {
          svg.dataset.frame = frame;
          svg.style.transform = facing < 0 ? "scaleX(-1)" : "";
        }
      }
      if (ballEl.current) {
        ballEl.current.style.transform = `translate(${Math.round(ball.x)}px, ${Math.round(ball.y)}px)`;
      }
      gems.forEach((g, i) => {
        const el = gemEls.current[i];
        if (!el) return;
        el.style.display = g.taken ? "none" : "";
        el.style.transform = `translate(${Math.round(g.x)}px, ${Math.round(g.y)}px)`;
      });
      particleEls.current.forEach((el, i) => {
        if (!el) return;
        const p = particles[i];
        if (!p) {
          el.style.display = "none";
          return;
        }
        el.style.display = "";
        el.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
      });
    };

    // The camera keeps the character a little above the middle of the
    // view (or of the space above the touch pad).
    const follow = (dt: number) => {
      const pad = document.querySelector(".game-pad")?.getBoundingClientRect().height ?? 0;
      const view = window.innerHeight - pad;
      const target = Math.max(0, hero.y + hero.h / 2 - view * 0.45);
      const current = window.scrollY;
      const next = calm() ? target : current + (target - current) * Math.min(1, dt * 6);
      if (Math.abs(next - current) > 0.5) window.scrollTo(window.scrollX, next);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // The layout can shift under the game (fonts, reveals, resizes), so
      // floors and gem anchors are re-read twice a second.
      sinceMeasure += dt;
      if (sinceMeasure > 0.5) {
        sinceMeasure = 0;
        measure();
        for (const g of gems) {
          const r = g.el.getBoundingClientRect();
          g.x = r.left + window.scrollX + g.dx;
          g.y = r.top + window.scrollY + g.dy;
        }
      }
      // Fixed sub-steps keep landings reliable at low frame rates.
      const steps = Math.ceil(dt / (1 / 120));
      for (let i = 0; i < steps; i++) tick(dt / steps);
      follow(dt);
      draw();
    };

    const onKey = (e: KeyboardEvent) => {
      const action = KEYS[e.key];
      if (!action) return;
      // Let the game's own buttons (Stop) work with Enter and Space.
      const target = e.target as Element | null;
      if ((e.key === "Enter" || e.key === " ") && target?.closest("[data-game-ui]")) return;
      e.preventDefault();
      if (action === "stop") {
        if (e.type === "keydown") setPlaying(false);
        return;
      }
      const down = e.type === "keydown";
      keys[action] = down;
      if (down && !e.repeat && (action === "jump" || action === "poke")) pressed[action] = true;
    };
    const clear = () => {
      for (const k of Object.keys(keys) as (keyof Input)[]) keys[k] = false;
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", clear);
    window.addEventListener("resize", measure);
    status.current?.focus({ preventScroll: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", measure);
      clear();
    };
  }, [playing]);

  // Touch pad buttons hold an input while pressed.
  const hold = (key: keyof Input) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      input.current[key] = true;
      if (key === "jump" || key === "poke") presses.current[key] = true;
      e.currentTarget.setAttribute("aria-pressed", "true");
    },
    onPointerUp: (e: ReactPointerEvent<HTMLButtonElement>) => {
      input.current[key] = false;
      e.currentTarget.setAttribute("aria-pressed", "false");
    },
    onPointerCancel: (e: ReactPointerEvent<HTMLButtonElement>) => {
      input.current[key] = false;
      e.currentTarget.setAttribute("aria-pressed", "false");
    },
    onContextMenu: (e: ReactMouseEvent) => e.preventDefault(),
  });

  const found = text.found.replace("{n}", String(score.n)).replace("{total}", String(score.total));
  const won = score.total > 0 && score.n === score.total;

  if (!playing) return null;

  return (
    <>
      <div ref={layer} className="game-layer" aria-hidden>
        <div ref={ballEl}>
          <Still rows={BALL} scale={SCALE} />
        </div>
        {Array.from({ length: gemCount }, (_, i) => (
          <div key={i} ref={(el) => void (gemEls.current[i] = el)} className="game-gem">
            <Still rows={GEM} scale={SCALE} />
          </div>
        ))}
        <div ref={heroEl}>
          <Hero scale={SCALE} />
        </div>
        {Array.from({ length: POOL }, (_, i) => (
          <span
            key={i}
            ref={(el) => void (particleEls.current[i] = el)}
            className={`block size-[3px] ${i % 3 ? "bg-ink" : "bg-accent"}`}
            style={{ display: "none" }}
          />
        ))}
      </div>

      {/* The heads-up display: score, help and a way out. */}
      <div
        data-game-ui
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2"
      >
        <div
          ref={status}
          tabIndex={-1}
          role="region"
          aria-label={text.region}
          className="dialog flex items-center gap-3 px-4 py-2 focus:outline-none"
        >
          <Still rows={GEM} scale={SCALE} />
          <span className="font-label text-sm" aria-live="polite">
            <span aria-hidden>
              {score.n}/{score.total}
            </span>
            <span className="sr-only">{won ? text.allFound : found}</span>
          </span>
          <button type="button" className="btn btn-solid min-h-9! px-3! text-sm!" onClick={() => setPlaying(false)}>
            {text.stop}
          </button>
        </div>
        <p className="dialog max-w-[22rem] px-4 py-2 text-sm leading-5">
          {won ? text.allFound : touch ? text.helpTouch : text.help}
        </p>
      </div>

      {/* The console's controls, pinned to the bottom of a touch screen. */}
      {touch && (
        <div
          data-game-ui
          className="game-pad fixed inset-x-0 bottom-0 z-40 flex items-center justify-between bg-plastic px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="grid grid-cols-3 grid-rows-3 gap-0.5" role="group" aria-label={text.region}>
            <button type="button" aria-label={text.pad.up} className="btn btn-case col-start-2 m-0! size-14 p-0!" {...hold("jump")}>▲︎</button>
            <button type="button" aria-label={text.pad.left} className="btn btn-case col-start-1 row-start-2 m-0! size-14 p-0!" {...hold("left")}>◀︎</button>
            <button type="button" aria-label={text.pad.right} className="btn btn-case col-start-3 row-start-2 m-0! size-14 p-0!" {...hold("right")}>▶︎</button>
            <button type="button" aria-label={text.pad.down} className="btn btn-case col-start-2 row-start-3 m-0! size-14 p-0!" {...hold("down")}>▼︎</button>
          </div>
          <div className="flex items-end gap-4 pb-2">
            <button type="button" aria-label={text.pad.b} className="btn btn-case size-16 p-0! font-label" {...hold("poke")}>B</button>
            <button type="button" aria-label={text.pad.a} className="btn btn-solid mb-8! size-16 p-0! font-label" {...hold("jump")}>A</button>
          </div>
        </div>
      )}
    </>
  );
}
