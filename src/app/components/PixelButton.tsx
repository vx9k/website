"use client";

import type { CSSProperties, ReactNode } from "react";

export type Action = "theme" | "gust" | "shake";

// Each action only flips an attribute on <html>; the CSS in globals.css
// does the rest, so a button is the only script the scene needs.
let calm: ReturnType<typeof setTimeout> | undefined;

function run(action: Action) {
  const root = document.documentElement;
  if (action === "theme") return window.vxTheme?.();
  if (action === "gust") {
    root.setAttribute("data-gust", "");
    clearTimeout(calm);
    calm = setTimeout(() => root.removeAttribute("data-gust"), 3000);
    return;
  }
  // Take the attribute off and force a style pass so the leaves fall again.
  root.removeAttribute("data-shaken");
  void root.offsetWidth;
  root.setAttribute("data-shaken", "");
}

export default function PixelButton({
  action,
  label,
  className,
  style,
  children,
}: {
  action: Action;
  label: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => run(action)}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
