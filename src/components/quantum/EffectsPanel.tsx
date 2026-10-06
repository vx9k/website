"use client";

import type { Dictionary } from "@/app/i18n";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { effects, flags, reducedMotion, setAll, setFlag } from "@/quantum/flags";
import { useStore } from "@/quantum/store";
import { returnFocus } from "@/quantum/ui";

/** One switch per effect, plus one for all of them. */
export default function EffectsPanel({
  open,
  onOpenChange,
  copy,
  closeLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: Dictionary["quantum"]["effects"];
  closeLabel: string;
}) {
  const on = useStore(flags);
  const still = useStore(reducedMotion);
  const allOn = effects.every((e) => on[e]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={closeLabel} onCloseAutoFocus={returnFocus}>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        {still && <p className="text-sm text-muted-foreground">{copy.reduced}</p>}
        <FieldGroup className="gap-5">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="effect-all" className="flex-auto">
              {copy.all}
            </FieldLabel>
            <Switch id="effect-all" checked={allOn} onCheckedChange={setAll} />
          </Field>
          <FieldSeparator />
          {effects.map((effect) => (
            <Field key={effect} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={`effect-${effect}`}>{copy.items[effect].name}</FieldLabel>
                <FieldDescription id={`effect-${effect}-note`}>{copy.items[effect].note}</FieldDescription>
              </FieldContent>
              <Switch
                id={`effect-${effect}`}
                aria-describedby={`effect-${effect}-note`}
                checked={on[effect]}
                onCheckedChange={(checked) => setFlag(effect, checked)}
              />
            </Field>
          ))}
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
