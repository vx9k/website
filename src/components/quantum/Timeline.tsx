"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { started, worlds } from "@/app/content";
import type { Dictionary } from "@/app/i18n";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { reducedMotion } from "@/quantum/flags";
import { travel } from "@/quantum/navigate";
import { useStore } from "@/quantum/store";
import { era, stops, worldOf, type Stop } from "@/quantum/time";
import { openPanel, returnFocus } from "@/quantum/ui";

// Roughly one row, for how far the others fall when one is chosen.
const rowHeight = 56;

// A stop in today's world takes you back to today.
const yearOf = (stop: Stop) => (stop.world === "now" ? null : stop.year);

/** The timeline: every skill at the year it first appeared, grouped by
 *  the world the page turns into there, with vx's own start marked among
 *  them. Choosing a stop collapses the rest into it, then the page
 *  travels there. Arrows move between stops, as in the branch map. */
export default function Timeline({
  open,
  onOpenChange,
  copy,
  closeLabel,
  names,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: Dictionary["quantum"]["time"];
  closeLabel: string;
  /** Each skill's name in this language, by id. */
  names: Record<string, string>;
}) {
  const year = useStore(era);
  const still = useStore(reducedMotion);
  const [chosen, setChosen] = useState<number | null>(null);
  const here = (stop: Stop) => yearOf(stop) === year;
  const chosenIndex = chosen === null ? -1 : stops.findIndex((s) => s.year === chosen);

  function choose(stop: Stop, keyboard: boolean) {
    if (chosen !== null) return;
    if (here(stop)) return onOpenChange(false);
    setChosen(stop.year);
    setTimeout(
      () => {
        openPanel.set(null);
        setTimeout(() => {
          setChosen(null);
          travel(yearOf(stop), keyboard);
        }, 220);
      },
      still ? 0 : 340,
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rows = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-row]")];
    const at = rows.indexOf(document.activeElement as HTMLButtonElement);
    const next: Record<string, number> = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: rows.length - 1 };
    if (!(event.key in next) || at < 0) return;
    event.preventDefault();
    rows[Math.max(0, Math.min(rows.length - 1, next[event.key]))].focus();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={closeLabel}
        className="max-h-[min(40rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)] sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const row = document.querySelector<HTMLElement>('.timeline button[aria-current="true"]');
          row?.focus({ preventScroll: true });
          row?.scrollIntoView({ block: "center" });
        }}
        onCloseAutoFocus={returnFocus}
      >
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <div
          className="branch-map timeline relative -mx-2 overflow-y-auto px-2"
          data-collapsing={chosen !== null ? "" : undefined}
          onKeyDown={onKeyDown}
        >
          <ol className="flex flex-col">
            {worlds.map(({ id: world }) => {
              const group = stops.filter((s) => s.world === world);
              if (!group.length) return null;
              const mark = worldOf(started) === world;
              return (
                <li key={world}>
                  <h3 className="label pt-3 pb-1 pl-8">{copy.worlds[world]}</h3>
                  <ol className="flex flex-col">
                    {group.map((stop) => {
                      const index = stops.indexOf(stop);
                      const pull = chosenIndex >= 0 ? (chosenIndex - index) * rowHeight * 0.6 : 0;
                      return [
                        <li key={stop.year} className="flex">
                          <button
                            type="button"
                            data-row=""
                            data-chosen={chosen === stop.year ? "" : undefined}
                            aria-current={here(stop) ? "true" : undefined}
                            style={{ "--pull": `${pull}px` } as CSSProperties}
                            onClick={(event) => choose(stop, event.detail === 0)}
                            className="relative flex flex-1 items-baseline gap-3 rounded-md py-2 pr-2 pl-8 text-left outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          >
                            <span aria-hidden className={cn("branch-dot timeline-dot", here(stop) && "branch-dot-here")} />
                            <span className="w-10 shrink-0 font-mono text-sm tabular-nums">{stop.year}</span>
                            <span className="flex min-w-0 flex-col leading-snug">
                              <span className="text-sm font-medium">{stop.skills.map((id) => names[id]).join(", ")}</span>
                              <span className="text-xs text-muted-foreground">
                                {copy.events[stop.year as keyof typeof copy.events]}
                              </span>
                            </span>
                          </button>
                        </li>,
                        mark && stop.year < started && (stops[index + 1]?.year ?? Infinity) > started && (
                          <li
                            key="started"
                            data-row=""
                            className="relative flex items-baseline gap-3 py-2 pr-2 pl-8 text-muted-foreground"
                          >
                            <span aria-hidden className="timeline-mark" />
                            <span className="w-10 shrink-0 font-mono text-sm tabular-nums">{started}</span>
                            <span className="text-sm">{copy.started}</span>
                          </li>
                        ),
                      ];
                    })}
                  </ol>
                </li>
              );
            })}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
