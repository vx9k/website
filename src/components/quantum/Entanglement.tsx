"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { pairs } from "@/app/content";

// Entanglement: each skill in a pair answers when the other is touched.
// Hovering one (or tapping it, on a touch screen) marks both: the one you
// touched spins one way and its partner the other (globals.css), and a
// faint line joins their tiles across the section.

const partner = new Map<string, string>(pairs.flatMap(([a, b]) => [[a, b], [b, a]]));

type Line = { d: string };

export default function Entanglement() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [line, setLine] = useState<Line | null>(null);

  useEffect(() => {
    const section = document.getElementById("skills");
    setHost(section);
    if (!section) return;
    let current: string | null = null;

    const item = (id: string) => section.querySelector<HTMLElement>(`[data-skill="${id}"]`);
    const centre = (el: HTMLElement, box: DOMRect) => {
      const r = el.querySelector(".icon-tile")!.getBoundingClientRect();
      // From just under each tile, so the arc stays clear of the names.
      return [r.left + r.width / 2 - box.left, r.bottom + 3 - box.top];
    };

    function set(id: string | null) {
      if (id === current) return;
      for (const el of section!.querySelectorAll("[data-entangled]")) el.removeAttribute("data-entangled");
      current = id;
      const other = id && partner.get(id);
      const a = id && item(id);
      const b = other && item(other);
      if (!a || !b) return setLine(null);
      a.dataset.entangled = "up";
      b.dataset.entangled = "down";
      const box = section!.getBoundingClientRect();
      const [x1, y1] = centre(a, box);
      const [x2, y2] = centre(b, box);
      // A gentle arc, bowed downwards whichever way round the pair is.
      const bow = Math.max(24, Math.abs(x2 - x1) * 0.22);
      const mx = (x1 + x2) / 2;
      const my = Math.max(y1, y2) + bow;
      setLine({ d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` });
    }

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      set((event.target as Element).closest?.<HTMLElement>("[data-skill]")?.dataset.skill ?? null);
    };
    // A touch "leaves" as soon as the finger lifts, so only a mouse or pen
    // leaving lets go here.
    const onLeave = (event: PointerEvent) => event.pointerType !== "touch" && set(null);
    const onResize = () => set(null);
    // On touch, a tap entangles; a tap anywhere else lets go.
    const onTap = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      set((event.target as Element).closest?.<HTMLElement>("#skills [data-skill]")?.dataset.skill ?? null);
    };

    section.addEventListener("pointerover", onOver);
    section.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onTap);
    window.addEventListener("resize", onResize);
    return () => {
      set(null);
      section.removeEventListener("pointerover", onOver);
      section.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onTap);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!host) return null;
  return createPortal(
    <svg aria-hidden className="entangle-line">
      {line && <path d={line.d} pathLength={1} />}
    </svg>,
    host,
  );
}
