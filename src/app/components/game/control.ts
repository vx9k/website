import { useEffect, useState } from "react";

// The game is started and stopped by window events, so the buttons that
// do it (the header, the character in the scene, the console's Start)
// stay tiny and don't import the engine. The game announces its state
// the same way, and mirrors it as data-playing on <html> for CSS.

export const REQUEST = "vx-game";
export const STATE = "vx-game-state";

export type Request = "toggle" | "start" | "stop";

export function requestGame(action: Request = "toggle") {
  window.dispatchEvent(new CustomEvent<Request>(REQUEST, { detail: action }));
}

export function usePlaying() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setPlaying((e as CustomEvent<boolean>).detail);
    setPlaying(document.documentElement.hasAttribute("data-playing"));
    window.addEventListener(STATE, on);
    return () => window.removeEventListener(STATE, on);
  }, []);
  return playing;
}
