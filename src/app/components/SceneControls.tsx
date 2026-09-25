"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type SceneText = {
  toDay: string;
  toNight: string;
  light: string;
};

type Box = { x: number; y: number; w: number; h: number };

const SWAP_MS = 450; // matches the sink/surface animations in globals.css

function isDay() {
  return document.documentElement.getAttribute("data-theme") !== "night";
}

function calm() {
  return document.documentElement.hasAttribute("data-motion");
}

/** Real buttons laid over the scene's sun or moon and its cabin, so the
 *  art is clickable, tappable and reachable by keyboard. Each button is
 *  at least 44px square whatever the scene's scale; its position is in
 *  grid units, turned into CSS by the .scene-button rule. */
export default function SceneControls({
  text,
  disc,
  cabin,
}: {
  text: SceneText;
  disc: Box;
  cabin: Box | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(false);
  const [lit, setLit] = useState(true);

  // Follow the theme however it changes: this button, the Display menu or
  // the system switching to dark mode.
  useEffect(() => {
    const scene = ref.current?.parentElement;
    const sync = () => {
      setDay(isDay());
      if (!scene?.dataset.light) setLit(!isDay());
    };
    sync();
    const observer = new MutationObserver(() => {
      // A new theme brings its own default for the cabin light.
      delete scene?.dataset.light;
      sync();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // iOS only applies :active on tap when a touch listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("touchstart", noop);
    };
  }, []);

  function swapTheme() {
    const scene = ref.current?.parentElement;
    const flip = () => {
      const flags = window.__vxFlags;
      if (!flags) return;
      flags.save({ ...flags.read(), day: !isDay() });
      flags.apply();
    };
    if (!scene || calm()) return flip();
    scene.classList.add("is-setting");
    setTimeout(() => {
      flip();
      scene.classList.replace("is-setting", "is-rising");
      setTimeout(() => scene.classList.remove("is-rising"), SWAP_MS);
    }, SWAP_MS);
  }

  function toggleLight() {
    const scene = ref.current?.parentElement;
    if (!scene) return;
    scene.dataset.light = lit ? "off" : "on";
    setLit(!lit);
  }

  const place = (b: Box) =>
    ({ "--gx": b.x, "--gy": b.y, "--gw": b.w, "--gh": b.h }) as CSSProperties;

  const discLabel = day ? text.toNight : text.toDay;

  return (
    <div ref={ref}>
      <button
        type="button"
        className="scene-button"
        style={place(disc)}
        aria-label={discLabel}
        title={discLabel}
        onClick={swapTheme}
      />
      {cabin && (
        <button
          type="button"
          className="scene-button"
          style={place(cabin)}
          aria-label={text.light}
          aria-pressed={lit}
          title={text.light}
          onClick={toggleLight}
        />
      )}
    </div>
  );
}
