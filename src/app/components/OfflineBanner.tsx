"use client";

import { useEffect, useRef, useState } from "react";
import { useOffline } from "next/offline";

// Built on Next's experimental offline support (experimental.useOffline in
// next.config.ts): the hook flips to true when a request fails or the
// browser reports it's offline, and Next retries blocked navigations once
// the connection is back. This banner just tells the visitor what's going on.
export default function OfflineBanner() {
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
    <div role="status" aria-live="polite" className="contents">
      {visible && (
        <div className="glass fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-3 rounded-full px-4 py-3 sm:inset-x-auto sm:right-6 sm:mx-0">
          <span
            aria-hidden
            className={`h-2 w-2 shrink-0 rounded-full ${
              offline ? "bg-sunbeam" : "bg-moss"
            }`}
          />
          <span className="font-mono text-xs text-ink">
            {offline
              ? "You're offline. Pages you've already opened still work."
              : "Back online."}
          </span>
        </div>
      )}
    </div>
  );
}
