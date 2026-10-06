"use client";

import { GitBranchIcon, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flags } from "@/quantum/flags";
import { useStore } from "@/quantum/store";
import { open, type Panel } from "@/quantum/ui";

const icons = { branches: GitBranchIcon, time: HistoryIcon };

/** Opens the branch map or the timeline (in the header), or the effects
 *  panel (in the footer). The dialogs themselves are loaded by
 *  QuantumRoot. The header's two show only their icons below lg, where
 *  the section links need the room, and the timeline's goes when time
 *  travel is switched off. */
export default function PanelButton({
  panel,
  label,
  className,
}: {
  panel: Exclude<Panel, null>;
  label: string;
  className?: string;
}) {
  const on = useStore(flags);
  if (panel === "effects") {
    return (
      <Button
        variant="link"
        size="sm"
        className={className}
        aria-haspopup="dialog"
        onClick={(event) => open(panel, event.currentTarget)}>
        {label}
      </Button>
    );
  }
  if (panel === "time" && !on.time) return null;
  const Icon = icons[panel];
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-haspopup="dialog"
      data-panel={panel}
      onClick={(event) => open(panel, event.currentTarget)}
    >
      <Icon data-icon="inline-start" />
      <span className="max-lg:sr-only">{label}</span>
    </Button>
  );
}
