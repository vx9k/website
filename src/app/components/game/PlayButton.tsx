"use client";

import { requestGame, usePlaying } from "./control";

/** Play / Stop in the console's top edge. Icon-only on phones. */
export default function PlayButton({ play, stop }: { play: string; stop: string }) {
  const playing = usePlaying();
  const label = playing ? stop : play;
  return (
    <button
      type="button"
      aria-pressed={playing}
      onClick={() => requestGame("toggle")}
      className="btn btn-solid min-h-10! px-3! text-base!"
    >
      <svg viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden focusable="false" className="size-3 fill-current">
        {playing ? <path d="M0 0h5v5H0z" /> : <path d="M0 0h1v5H0zM1 1h1v3H1zM2 1h1v3H2zM3 2h1v1H3z" />}
      </svg>
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );
}
