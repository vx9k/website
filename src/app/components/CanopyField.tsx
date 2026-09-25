"use client";

import { useEffect, useRef, useState } from "react";
import type { Renderer } from "./canopy-gpu";

// The forest behind the page. Always renders a CSS gradient first; a GPU
// shader fades in on top only when it's worth running:
//   - WebGPU, else WebGL2, and never a software renderer
//   - not with reduced motion, high contrast, e-ink, or Save-Data
//   - paused while the tab is hidden
// The shader module itself is loaded lazily, after the page is idle.

const FRAME_MS = 1000 / 30; // the fog is slow; 30fps halves GPU work

function allowed() {
  const d = document.documentElement;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  return !(
    d.hasAttribute("data-motion") ||
    d.hasAttribute("data-contrast") ||
    d.hasAttribute("data-display") ||
    conn?.saveData
  );
}

export default function CanopyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: Renderer | null = null;
    let raf = 0;
    let last = 0;
    let loading = false;
    let broken = false;
    let disposed = false;
    const pointer = { x: 0.7, y: 0.75, tx: 0.7, ty: 0.75 };

    const scale = () =>
      Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5) *
      0.75; // soft fog: rendering under native resolution is invisible

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!renderer || now - last < FRAME_MS) return;
      last = now;
      const s = scale();
      const w = Math.max(1, Math.round(canvas.clientWidth * s));
      const h = Math.max(1, Math.round(canvas.clientHeight * s));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      renderer.draw({ width: w, height: h, time: now / 1000, px: pointer.x, py: pointer.y });
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const teardown = () => {
      stop();
      renderer?.destroy();
      renderer = null;
      setLive(false);
    };

    const onLost = () => {
      broken = true;
      teardown();
    };

    const start = async () => {
      if (disposed || broken || document.hidden || !allowed()) return;
      if (renderer) {
        if (!raf) raf = requestAnimationFrame(frame);
        return;
      }
      if (loading) return;
      loading = true;
      const gpu = await import("./canopy-gpu");
      renderer =
        (await gpu.createWebGPU(canvas, onLost)) ?? gpu.createWebGL2(canvas, onLost);
      loading = false;
      if (disposed || !renderer) {
        renderer?.destroy();
        renderer = null;
        broken = !disposed; // no usable GPU: keep the CSS fallback for good
        return;
      }
      if (!allowed() || document.hidden) return teardown();
      raf = requestAnimationFrame(frame);
      setLive(true);
    };

    const sync = () => {
      if (!allowed()) teardown();
      else if (document.hidden) stop();
      else start();
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = 1 - e.clientY / window.innerHeight;
    };

    // Modes are attributes on <html>; follow them as they change.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion", "data-contrast", "data-display"],
    });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Safari has no requestIdleCallback; fall back to a short timeout.
    const w = window as Window &
      Partial<Pick<Window, "requestIdleCallback" | "cancelIdleCallback">>;
    const idleId = w.requestIdleCallback?.(() => start(), { timeout: 2000 });
    const timerId = idleId === undefined ? window.setTimeout(start, 400) : undefined;

    return () => {
      disposed = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
      teardown();
    };
  }, []);

  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 -z-10 eink:hidden hc:hidden">
      <div className="canopy-fallback absolute inset-0" />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-[1.2s] ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
