"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { Dictionary } from "@/app/i18n";
import type { Locale } from "@/app/i18n/locales";
import type { Place } from "@/quantum/branches";
import { flags, loadFlags, reducedMotion } from "@/quantum/flags";
import { startNavigation } from "@/quantum/navigate";
import { useStore } from "@/quantum/store";
import { startSuperposition } from "@/quantum/superposition";
import { era, startTime, worldOf } from "@/quantum/time";
import { openPanel } from "@/quantum/ui";

// Everything visible is loaded on demand, so the first load only carries
// this file and the small stores under src/quantum/.
const Ghosts = lazy(() => import("./Ghosts"));
const BranchMap = lazy(() => import("./BranchMap"));
const Timeline = lazy(() => import("./Timeline"));
const EffectsPanel = lazy(() => import("./EffectsPanel"));
const EraStrip = lazy(() => import("./EraStrip"));
const Background = lazy(() => import("./Background"));
const ProbabilityCursor = lazy(() => import("./ProbabilityCursor"));
const Entanglement = lazy(() => import("./Entanglement"));
const Orbital = lazy(() => import("./Orbital"));

export type Echo = { lang: Locale; line: string };

/** The quantum layer's one mount point, after the page in the layout. It
 *  renders nothing on the server, so the page's HTML is unchanged. */
export default function QuantumRoot({
  lang,
  copy,
  places,
  echoes,
  names,
}: {
  lang: Locale;
  copy: Dictionary["quantum"];
  /** What each place is called on this page, for the map and the ghosts. */
  places: Record<Place, string>;
  /** The headline in the other languages, echoed behind the introduction. */
  echoes: Echo[];
  /** Each skill's name in this language, for the timeline. */
  names: Record<string, string>;
}) {
  const [ready, setReady] = useState(false);
  // A dialog stays mounted once opened, so it can animate closed.
  const [opened, setOpened] = useState<{ branches?: true; time?: true; effects?: true }>({});
  const on = useStore(flags);
  const panel = useStore(openPanel);
  const year = useStore(era);
  const still = useStore(reducedMotion);
  // The probability cursor needs a mouse: a pointer that hovers.
  const [mouse, setMouse] = useState(false);

  useEffect(() => {
    loadFlags();
    const stopNavigation = startNavigation(lang);
    const stopTime = startTime();
    setReady(true);
    // Fetch the dialogs while the page is idle, so they open at once.
    const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 2000));
    idle(() => {
      import("./BranchMap");
      import("./Timeline");
      import("./EffectsPanel");
      import("./EraStrip");
    });
    return () => {
      stopNavigation();
      stopTime();
    };
  }, [lang]);

  useEffect(() => {
    if (panel) setOpened((o) => ({ ...o, [panel]: true }));
  }, [panel]);

  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setMouse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Superposition is all motion, so it waits for motion to be allowed.
  useEffect(() => {
    if (ready && on.superposition && !still) return startSuperposition();
  }, [ready, on.superposition, still]);

  if (!ready) return null;
  const close = (open: boolean) => !open && openPanel.set(null);
  return (
    <>
      {/* Says where in time the page is whenever that changes. */}
      <p aria-live="polite" className="sr-only">
        {year === null ? copy.time.worlds.now : `${year}, ${copy.time.worlds[worldOf(year)]}`}
      </p>
      <Suspense fallback={null}>
        {on.ghosts && <Ghosts lang={lang} places={places} echoes={echoes} />}
        {/* Today only: the past eras paint their own backgrounds. */}
        {(on.interference || on.foam) && year === null && (
          <Background waves={on.interference} foam={on.foam} still={still} />
        )}
        {on.cursor && mouse && !still && <ProbabilityCursor />}
        {on.entanglement && <Entanglement />}
        {on.orbital && <Orbital still={still} />}
        {year !== null && <EraStrip copy={copy.time} />}
        {opened.branches && (
          <BranchMap
            open={panel === "branches"}
            onOpenChange={close}
            copy={copy.branches}
            closeLabel={copy.close}
            places={places}
          />
        )}
        {opened.time && (
          <Timeline
            open={panel === "time"}
            onOpenChange={close}
            copy={copy.time}
            closeLabel={copy.close}
            names={names}
          />
        )}
        {opened.effects && (
          <EffectsPanel open={panel === "effects"} onOpenChange={close} copy={copy.effects} closeLabel={copy.close} />
        )}
      </Suspense>
    </>
  );
}
