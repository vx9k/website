"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Dictionary } from "@/app/i18n";
import { locales } from "@/app/i18n/locales";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { tree, type Branch, type Place } from "@/quantum/branches";
import { reducedMotion } from "@/quantum/flags";
import { jump } from "@/quantum/navigate";
import { useStore } from "@/quantum/store";
import { openPanel, returnFocus } from "@/quantum/ui";

// Geometry of the graph: one row per branch, one column per level.
const rowHeight = 48;
const column = 18;
const inset = 14;

type Row = { node: Branch; depth: number; index: number; siblings: number; position: number; children: number };

// Depth-first, siblings oldest first: a branch sits under its parent, and
// a split shows as a new column to the right, like a commit graph.
function layout(nodes: Branch[]): Row[] {
  const ids = new Set(nodes.map((n) => n.id));
  const children = new Map<string | null, Branch[]>();
  for (const node of nodes) {
    const parent = node.parent && ids.has(node.parent) ? node.parent : null;
    children.set(parent, [...(children.get(parent) ?? []), node]);
  }
  for (const list of children.values()) list.sort((a, b) => a.at - b.at);
  const rows: Row[] = [];
  const walk = (parent: string | null, depth: number) => {
    const list = children.get(parent) ?? [];
    list.forEach((node, i) => {
      rows.push({
        node,
        depth,
        index: rows.length,
        siblings: list.length,
        position: i + 1,
        children: children.get(node.id)?.length ?? 0,
      });
      walk(node.id, depth + 1);
    });
  };
  walk(null, 0);
  return rows;
}

const x = (depth: number) => inset + depth * column;
const y = (index: number) => index * rowHeight + rowHeight / 2;

/** The map of branches: pick one to collapse onto it. A tree for
 *  keyboards (arrows move, Enter jumps), rows for everyone else. */
export default function BranchMap({
  open,
  onOpenChange,
  copy,
  closeLabel,
  places,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: Dictionary["quantum"]["branches"];
  closeLabel: string;
  places: Record<Place, string>;
}) {
  const { nodes, current } = useStore(tree);
  const still = useStore(reducedMotion);
  const rows = layout(nodes);
  const byId = new Map(rows.map((r) => [r.node.id, r]));
  const [active, setActive] = useState<string | null>(current);
  const [chosen, setChosen] = useState<string | null>(null);
  const focused = byId.has(active ?? "") ? active : current;
  const width = x(Math.max(0, ...rows.map((r) => r.depth))) + inset;

  // Collapse onto the branch: the others fall into it, the dialog closes,
  // then the page tunnels there.
  function choose(id: string, keyboard: boolean) {
    if (chosen) return;
    if (id === current) return onOpenChange(false);
    setChosen(id);
    setTimeout(
      () => {
        openPanel.set(null);
        setTimeout(() => {
          setChosen(null);
          jump(id, keyboard);
        }, 220);
      },
      still ? 0 : 340,
    );
  }

  function focusRow(id: string | undefined) {
    if (!id) return;
    setActive(id);
    document.getElementById(`branch-${id}`)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const row = byId.get(focused ?? "");
    if (!row) return;
    const move: Record<string, string | undefined> = {
      ArrowDown: rows[row.index + 1]?.node.id,
      ArrowUp: rows[row.index - 1]?.node.id,
      ArrowLeft: row.node.parent ?? undefined,
      ArrowRight: rows[row.index + 1]?.node.parent === row.node.id ? rows[row.index + 1].node.id : undefined,
      Home: rows[0]?.node.id,
      End: rows.at(-1)?.node.id,
    };
    if (event.key in move) {
      event.preventDefault();
      focusRow(move[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(row.node.id, true);
    }
  }

  const chosenRow = chosen ? byId.get(chosen) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={closeLabel}
        className="max-h-[min(40rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)] sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          setActive(current);
          document.getElementById(`branch-${current}`)?.focus();
        }}
        onCloseAutoFocus={returnFocus}
      >
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <div className="branch-map relative -mx-2 overflow-y-auto px-2" data-collapsing={chosen ? "" : undefined}>
          <svg
            aria-hidden
            className="pointer-events-none absolute top-0 left-2"
            width={width}
            height={rows.length * rowHeight}
          >
            {rows.map((r) => {
              const parent = byId.get(r.node.parent ?? "");
              if (!parent) return null;
              const x1 = x(parent.depth);
              const x2 = x(r.depth);
              const y2 = y(r.index);
              return (
                <path
                  key={r.node.id}
                  pathLength={1}
                  style={{ "--row": r.index } as CSSProperties}
                  d={`M${x1} ${y(parent.index)} V${y2 - 10} Q${x1} ${y2} ${x1 + 10} ${y2} H${x2}`}
                />
              );
            })}
          </svg>
          <ul role="tree" aria-label={copy.title} onKeyDown={onKeyDown} className="relative flex flex-col">
            {rows.map((r) => {
              const here = r.node.id === current;
              const pull = chosenRow ? (chosenRow.index - r.index) * rowHeight * 0.6 : 0;
              return (
                <li
                  key={r.node.id}
                  id={`branch-${r.node.id}`}
                  role="treeitem"
                  aria-level={r.depth + 1}
                  aria-setsize={r.siblings}
                  aria-posinset={r.position}
                  aria-expanded={r.children ? true : undefined}
                  aria-current={here ? "location" : undefined}
                  tabIndex={r.node.id === focused ? 0 : -1}
                  data-row=""
                  data-chosen={r.node.id === chosen ? "" : undefined}
                  style={{ "--row": r.index, "--pull": `${pull}px`, height: rowHeight } as CSSProperties}
                  onClick={(event) => choose(r.node.id, event.detail === 0)}
                  onFocus={() => setActive(r.node.id)}
                  className="relative flex cursor-pointer items-center gap-3 rounded-md pr-2 outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span aria-hidden className="relative shrink-0" style={{ width }}>
                    <span
                      className={cn("branch-dot absolute top-1/2 -translate-1/2", here && "branch-dot-here")}
                      style={{ left: x(r.depth) }}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">
                      {places[r.node.place]}
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {locales[r.node.lang].short}
                        {r.node.year !== null && ` · ${r.node.year}`}
                      </span>
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {here ? copy.here : copy.choice[r.node.choice]}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
