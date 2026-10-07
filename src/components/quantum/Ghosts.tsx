"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/app/i18n/locales";
import { places, tree, type Place } from "@/quantum/branches";
import { seeded } from "@/quantum/seed";
import { useStore } from "@/quantum/store";
import type { Echo } from "./QuantumRoot";

const fixed = (n: number, digits = 1) => n.toFixed(digits);

/** Superposition: the places you could have gone and haven't yet, faint
 *  behind the one you're in. The other sections' titles drift on the right
 *  of the view; on the introduction, the headline in the other languages
 *  lies over the real one, a few pixels off, wrapping the same way. Each
 *  fades for good once you've been there. Positions are seeded by the
 *  branch, so every branch has its own. The text is CSS generated content
 *  with empty alt text (globals.css), so it's never page text and screen
 *  readers skip it. */
export default function Ghosts({
  lang,
  places: names,
  echoes,
}: {
  lang: Locale;
  places: Record<Place, string>;
  echoes: Echo[];
}) {
  const { nodes, current } = useStore(tree);
  const here = nodes.find((n) => n.id === current);
  const view = here && here.lang === lang ? here.place : null;
  const [hosts, setHosts] = useState<{ view: Element | null; echo: Element | null }>({ view: null, echo: null });

  useEffect(() => {
    setHosts({
      view: view ? document.querySelector(`[data-branch-view="${view}"]`) : null,
      echo: view === "top" ? document.querySelector("[data-branch-echo]") : null,
    });
  }, [view]);

  if (!here) return null;
  const seen = (l: Locale, p: Place) => nodes.some((n) => n.lang === l && n.place === p);
  const titles = places.filter((p) => p !== here.place && !seen(lang, p));
  const lines = here.place === "top" ? echoes.filter((e) => !seen(e.lang, "top")) : [];
  const flicker = (random: () => number) => ({
    "--o": fixed(0.05 + random() * 0.04, 3),
    "--b": `${fixed(1 + random() * 2)}px`,
    "--t": `${fixed(4 + random() * 5)}s`,
    "--delay": `${fixed(-random() * 6)}s`,
  });

  return (
    <>
      {hosts.view &&
        titles.length > 0 &&
        createPortal(
          <div aria-hidden className="ghosts" data-in={here.place === "top" ? "intro" : "section"}>
            {titles.map((place) => {
              const random = seeded(`${here.id}:${place}`);
              const style = {
                "--r": `${fixed(random() * 22)}%`,
                "--y": fixed(random()),
                ...flicker(random),
              } as CSSProperties;
              return <span key={place} data-ghost={names[place]} style={style} />;
            })}
          </div>,
          hosts.view,
        )}
      {hosts.echo &&
        lines.map(({ lang: other, line }) => {
          const random = seeded(`${here.id}:${other}`);
          // Shrunk to the headline's length, so a longer translation wraps
          // into the same lines instead of spilling onto the text below.
          const fit = Math.min(1, Math.max(0.7, (hosts.echo!.textContent?.length ?? line.length) / line.length));
          const style = {
            "--dx": `${fixed(random() * 16 - 8)}px`,
            "--dy": `${fixed(random() * 20 - 10)}px`,
            "--fit": fixed(fit, 3),
            ...flicker(random),
          } as CSSProperties;
          return createPortal(<span aria-hidden className="echo" data-ghost={line} style={style} />, hosts.echo!, other);
        })}
    </>
  );
}
