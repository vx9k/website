"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Dictionary } from "@/app/i18n";
import { Button } from "@/components/ui/button";
import { travel } from "@/quantum/navigate";
import { useStore } from "@/quantum/store";
import { era, worldOf } from "@/quantum/time";

/** While the page is in the past: a strip along the bottom of the sticky
 *  header with the year, the world and the way back, so a visitor who
 *  wanders in is never more than one click from today. */
export default function EraStrip({ copy }: { copy: Dictionary["quantum"]["time"] }) {
  const year = useStore(era);
  const [header, setHeader] = useState<Element | null>(null);

  useEffect(() => setHeader(document.querySelector(".site-header")), []);

  // The strip goes with the trip, so a keyboard user lands on the
  // timeline's button instead of the top of the page.
  async function back(event: MouseEvent) {
    const keyboard = event.detail === 0;
    await travel(null, keyboard);
    if (keyboard) setTimeout(() => document.querySelector<HTMLElement>('[data-panel="time"]')?.focus(), 800);
  }

  if (!header || year === null) return null;
  return createPortal(
    <div className="era-strip border-t">
      <div className="shell flex items-center justify-between gap-3 py-1.5 text-sm">
        <p className="min-w-0 leading-snug">
          <span className="font-mono tabular-nums">{year}</span>
          <span aria-hidden> · </span>
          <span className="sr-only">, </span>
          {copy.worlds[worldOf(year)]}
        </p>
        <Button variant="outline" size="sm" className="shrink-0" onClick={back}>
          {copy.now}
        </Button>
      </div>
    </div>,
    header,
  );
}
