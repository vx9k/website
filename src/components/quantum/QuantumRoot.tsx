"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { Dictionary } from "@/app/i18n";
import type { Locale } from "@/app/i18n/locales";
import type { Place } from "@/quantum/branches";
import { flags, loadFlags } from "@/quantum/flags";
import { startNavigation } from "@/quantum/navigate";
import { useStore } from "@/quantum/store";
import { openPanel } from "@/quantum/ui";

// Everything visible is loaded on demand, so the first load only carries
// this file and the small stores under src/quantum/.
const Ghosts = lazy(() => import("./Ghosts"));
const BranchMap = lazy(() => import("./BranchMap"));
const EffectsPanel = lazy(() => import("./EffectsPanel"));

export type Echo = { lang: Locale; line: string };

/** The quantum layer's one mount point, after the page in the layout. It
 *  renders nothing on the server, so the page's HTML is unchanged. */
export default function QuantumRoot({
  lang,
  copy,
  places,
  echoes,
}: {
  lang: Locale;
  copy: Dictionary["quantum"];
  /** What each place is called on this page, for the map and the ghosts. */
  places: Record<Place, string>;
  /** The headline in the other languages, echoed behind the introduction. */
  echoes: Echo[];
}) {
  const [ready, setReady] = useState(false);
  // A dialog stays mounted once opened, so it can animate closed.
  const [opened, setOpened] = useState<{ branches?: true; effects?: true }>({});
  const on = useStore(flags);
  const panel = useStore(openPanel);

  useEffect(() => {
    loadFlags();
    const stop = startNavigation(lang);
    setReady(true);
    // Fetch the dialogs while the page is idle, so they open at once.
    const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 2000));
    idle(() => {
      import("./BranchMap");
      import("./EffectsPanel");
    });
    return stop;
  }, [lang]);

  useEffect(() => {
    if (panel) setOpened((o) => ({ ...o, [panel]: true }));
  }, [panel]);

  if (!ready) return null;
  const close = (open: boolean) => !open && openPanel.set(null);
  return (
    <Suspense fallback={null}>
      {on.ghosts && <Ghosts lang={lang} places={places} echoes={echoes} />}
      {opened.branches && (
        <BranchMap
          open={panel === "branches"}
          onOpenChange={close}
          copy={copy.branches}
          closeLabel={copy.close}
          places={places}
        />
      )}
      {opened.effects && (
        <EffectsPanel open={panel === "effects"} onOpenChange={close} copy={copy.effects} closeLabel={copy.close} />
      )}
    </Suspense>
  );
}
