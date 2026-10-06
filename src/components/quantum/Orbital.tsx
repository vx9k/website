"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { tree } from "@/quantum/branches";
import { seeded } from "@/quantum/seed";
import { useStore } from "@/quantum/store";

// The orbital: a cloud of points sampled from a hydrogen atom's probability
// density |ψ|², turning slowly in the space beside the introduction. The
// branch picks the orbital. Lengths are in Bohr radii, and the angular part
// is about the z axis, which is drawn upright.
const orbitals = {
  // 2p (m = 0): ψ ∝ r e^(−r/2) cos θ
  "2p": { reach: 14, density: (r: number, c: number) => r * r * Math.exp(-r) * c * c },
  // 3d (m = 0): ψ ∝ r² e^(−r/3) (3cos²θ − 1)
  "3dz2": { reach: 24, density: (r: number, c: number) => r ** 4 * Math.exp((-2 * r) / 3) * (3 * c * c - 1) ** 2 },
  // 3d (m = ±1, real xz): ψ ∝ r² e^(−r/3) sin θ cos θ cos φ
  "3dxz": {
    reach: 24,
    density: (r: number, c: number, cosPhi: number) => r ** 4 * Math.exp((-2 * r) / 3) * (1 - c * c) * c * c * cosPhi * cosPhi,
  },
} as const;

type Name = keyof typeof orbitals;
const names = Object.keys(orbitals) as Name[];
const count = 1600;

// Rejection sampling: uniform points in the cube, kept in proportion to
// the density at each one.
function sample(name: Name, random: () => number) {
  const { reach, density } = orbitals[name];
  let peak = 0;
  for (let i = 0; i < 4000; i++) {
    const [x, y, z] = [random(), random(), random()].map((v) => (v * 2 - 1) * reach);
    const r = Math.hypot(x, y, z) || 1e-6;
    peak = Math.max(peak, density(r, z / r, x / (Math.hypot(x, y) || 1e-6)));
  }
  const out = new Float32Array(count * 3);
  for (let n = 0; n < count; ) {
    const [x, y, z] = [random(), random(), random()].map((v) => (v * 2 - 1) * reach);
    const r = Math.hypot(x, y, z) || 1e-6;
    if (random() * peak < density(r, z / r, x / (Math.hypot(x, y) || 1e-6))) {
      out.set([x / reach, y / reach, z / reach], n * 3);
      n++;
    }
  }
  return out;
}

export default function Orbital({ still }: { still: boolean }) {
  const { current } = useStore(tree);
  const [host, setHost] = useState<Element | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const random = seeded(`orbital:${current ?? ""}`);
  const name = names[Math.floor(random() * names.length)];

  useEffect(() => setHost(document.querySelector('[data-branch-view="top"]')), []);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const node: HTMLCanvasElement = el;
    const points = sample(name, seeded(`orbital-points:${name}`));
    const size = el.clientWidth || 320;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    el.width = el.height = size * ratio;
    ctx.scale(ratio, ratio);
    const ink = getComputedStyle(el).color;
    const tilt = 0.35;

    function draw(angle: number) {
      ctx!.clearRect(0, 0, size, size);
      ctx!.fillStyle = ink;
      const c = size / 2;
      const scale = size * 0.46;
      const [sa, ca, st, ct] = [Math.sin(angle), Math.cos(angle), Math.sin(tilt), Math.cos(tilt)];
      for (let i = 0; i < count; i++) {
        const x = points[i * 3], y = points[i * 3 + 1], z = points[i * 3 + 2];
        // Turn about the upright z axis, then tip towards the viewer.
        const x1 = x * ca - y * sa;
        const y1 = x * sa + y * ca;
        const up = z * ct - y1 * st;
        const depth = z * st + y1 * ct;
        ctx!.globalAlpha = 0.1 + (depth + 1) * 0.12;
        ctx!.fillRect(c + x1 * scale, c - up * scale, 1.4, 1.4);
      }
      // The nucleus, a mark.
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = getComputedStyle(node).getPropertyValue("--signal").trim() || ink;
      ctx!.fillRect(c - 1.5, c - 1.5, 3, 3);
    }

    // It turns only while it's on screen and motion is allowed.
    let frame = 0;
    let shown = false;
    const start = performance.now();
    const loop = (now: number) => {
      draw(((now - start) / 1000) * 0.25);
      frame = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(([entry]) => {
      shown = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (shown && !still && !document.hidden) frame = requestAnimationFrame(loop);
    });
    observer.observe(node);
    const onVisible = () => {
      cancelAnimationFrame(frame);
      if (shown && !still && !document.hidden) frame = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisible);
    draw(0.6);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [name, still, host]);

  if (!host) return null;
  return createPortal(<canvas ref={canvas} aria-hidden className="orbital" data-orbital={name} />, host);
}
