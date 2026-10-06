"use client";

import { GitBranchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { open, type Panel } from "@/quantum/ui";

/** Opens the branch map (in the header) or the effects panel (in the
 *  footer). The dialogs themselves are loaded by QuantumRoot. */
export default function PanelButton({ panel, label }: { panel: Exclude<Panel, null>; label: string }) {
  if (panel === "branches") {
    return (
      <Button variant="ghost" size="sm" aria-haspopup="dialog" onClick={(event) => open(panel, event.currentTarget)}>
        <GitBranchIcon data-icon="inline-start" />
        <span className="max-sm:sr-only">{label}</span>
      </Button>
    );
  }
  return (
    <Button variant="link" size="sm" aria-haspopup="dialog" onClick={(event) => open(panel, event.currentTarget)}>
      {label}
    </Button>
  );
}
