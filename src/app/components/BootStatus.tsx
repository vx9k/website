"use client";

import { useEffect, useState } from "react";

const STEPS = ["4init", "4rc", "ready"];

export default function BootStatus() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduceMotion =
      document.documentElement.getAttribute("data-motion") === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setStep(STEPS.length - 1);
      return;
    }

    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 480);
    return () => clearTimeout(t);
  }, [step]);

  const done = step === STEPS.length - 1;

  return (
    <span className="font-mono text-sm text-muted">
      boot: {STEPS[step]}
      {!done && <span className="cursor-pulse">_</span>}
    </span>
  );
}
