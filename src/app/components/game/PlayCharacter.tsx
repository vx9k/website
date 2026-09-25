"use client";

import { requestGame } from "./control";
import { Hero } from "./Sprite";

/** The character waiting at the foot of the mountains. Tapping it starts
 *  the game, which spawns the playable character exactly here. */
export default function PlayCharacter({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-hero-spawn
      aria-label={label}
      title={label}
      onClick={() => requestGame("start")}
      className="scene-hero absolute bottom-0 z-1 flex min-h-11 min-w-11 items-end justify-center playing:invisible"
    >
      <span className="more block">
        <Hero />
      </span>
    </button>
  );
}
