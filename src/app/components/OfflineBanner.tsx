"use client";

import { useEffect, useRef, useState } from "react";
import { useOffline } from "next/offline";

// Built on Next's experimental offline support (experimental.useOffline in
// next.config.ts): the hook flips to true when a request fails or the
// browser reports it's offline, and Next retries blocked navigations once
// the connection is back. This banner just tells the visitor what's going on.
export default function OfflineBanner({
  text,
}: {
  text: { down: string; back: string };
}) {
  const offline = useOffline();
  const wasOffline = useRef(false);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    if (offline) {
      wasOffline.current = true;
      setReconnected(false);
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    setReconnected(true);
    const t = setTimeout(() => setReconnected(false), 3000);
    return () => clearTimeout(t);
  }, [offline]);

  const visible = offline || reconnected;

  // The live region stays mounted so screen readers announce the change.
  return (
    <div role="status" aria-live="polite" className="no-print">
      {visible && (
        <div className="panel fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-3 px-4 py-3 sm:inset-x-auto sm:right-6 sm:mx-0">
          <span
            aria-hidden
            className={`size-1.5 shrink-0 ${
              offline ? "bg-sun" : "bg-ember"
            }`}
          />
          <span className="font-mono text-xs text-ink">
            {offline ? text.down : text.back}
          </span>
        </div>
      )}
    </div>
  );
}
