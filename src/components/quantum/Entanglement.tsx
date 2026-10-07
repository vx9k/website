"use client";

import { useEffect } from "react";
import { pairs } from "@/app/content";

// Entanglement: each skill in a pair answers when the other is touched.
// Hovering one (or tapping it, on a touch screen) marks both: the one you
// touched spins one way and its partner the other, and both take their
// colours (globals.css). It draws nothing of its own.

const partner = new Map<string, string>(pairs.flatMap(([a, b]) => [[a, b], [b, a]]));

export default function Entanglement() {
  useEffect(() => {
    const section = document.getElementById("skills");
    if (!section) return;
    let current: string | null = null;

    const item = (id: string) => section.querySelector<HTMLElement>(`[data-skill="${id}"]`);

    function set(id: string | null) {
      if (id === current) return;
      for (const el of section!.querySelectorAll("[data-entangled]")) el.removeAttribute("data-entangled");
      current = id;
      const other = id && partner.get(id);
      const a = id && item(id);
      const b = other && item(other);
      if (!a || !b) return;
      a.dataset.entangled = "up";
      b.dataset.entangled = "down";
    }

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      set((event.target as Element).closest?.<HTMLElement>("[data-skill]")?.dataset.skill ?? null);
    };
    // A touch "leaves" as soon as the finger lifts, so only a mouse or pen
    // leaving lets go here.
    const onLeave = (event: PointerEvent) => event.pointerType !== "touch" && set(null);
    // On touch, a tap entangles; a tap anywhere else lets go.
    const onTap = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      set((event.target as Element).closest?.<HTMLElement>("#skills [data-skill]")?.dataset.skill ?? null);
    };

    section.addEventListener("pointerover", onOver);
    section.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onTap);
    return () => {
      set(null);
      section.removeEventListener("pointerover", onOver);
      section.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onTap);
    };
  }, []);

  return null;
}
