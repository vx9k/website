"use client";

import { useEffect, useRef } from "react";

// The probability cursor: the pointer isn't at one place but spread over a
// Gaussian cloud of where it might be, drawn as faint dots around the real
// cursor (which stays). A click is a measurement: the cloud collapses to
// one sampled point, which flashes, then spreads out again. Desktop only,
// and it only draws while the pointer moves or a flash is fading.

const size = 220;
const dots = 42;

// A standard normal sample (Box–Muller).
function gauss() {
  let u = 0;
  while (u === 0) u = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

export default function ProbabilityCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    el.width = el.height = size * ratio;
    ctx.scale(ratio, ratio);

    const points = Array.from({ length: dots }, () => ({ x: gauss(), y: gauss() }));
    let spread = 14;
    let flash: { x: number; y: number; at: number } | null = null;
    let lastMove = 0;
    let frame = 0;
    let visible = false;

    const colour = () => getComputedStyle(document.documentElement).color;
    const signal = () => getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || colour();

    function draw(now: number) {
      frame = 0;
      ctx!.clearRect(0, 0, size, size);
      const c = size / 2;
      // A few samples move each frame: the cloud never quite settles.
      for (let i = 0; i < 4; i++) points[(Math.random() * dots) | 0] = { x: gauss(), y: gauss() };
      spread += (14 - spread) * 0.08;
      ctx!.fillStyle = colour();
      for (const p of points) {
        const r = Math.hypot(p.x, p.y);
        ctx!.globalAlpha = Math.max(0, 0.32 - r * 0.1);
        ctx!.beginPath();
        ctx!.arc(c + p.x * spread, c + p.y * spread, 1.3, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (flash) {
        const t = (now - flash.at) / 450;
        if (t >= 1) flash = null;
        else {
          ctx!.globalAlpha = 1 - t;
          ctx!.strokeStyle = signal();
          ctx!.fillStyle = signal();
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.arc(c + flash.x, c + flash.y, 2 + t * 14, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(c + flash.x, c + flash.y, 2.5 * (1 - t), 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;
      if (flash || now - lastMove < 600) frame = requestAnimationFrame(draw);
    }

    const wake = () => (frame ||= requestAnimationFrame(draw));

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      el!.style.transform = `translate(${event.clientX - size / 2}px, ${event.clientY - size / 2}px)`;
      if (!visible) {
        visible = true;
        el!.style.opacity = "1";
      }
      lastMove = performance.now();
      wake();
    }

    function onDown(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      // The measurement: one sample from the cloud, and the cloud collapses.
      flash = { x: gauss() * spread, y: gauss() * spread, at: performance.now() };
      spread = 2;
      wake();
    }

    function onOut(event: PointerEvent) {
      if (event.relatedTarget) return;
      visible = false;
      el!.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerout", onOut);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="probability-cursor" />;
}
