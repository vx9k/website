import { createStore } from "./store";

// Which of the two dialogs is open. The buttons that open them live in the
// header and footer, the dialogs in QuantumRoot, so they meet here.
export type Panel = "branches" | "effects" | null;
export const openPanel = createStore<Panel>(null);

// The button that opened the dialog. Radix hands focus back to a dialog's
// own trigger when it closes, and these dialogs have none, so they hand it
// back to this one instead.
let opener: HTMLElement | null = null;

export function open(panel: Exclude<Panel, null>, from: HTMLElement) {
  opener = from;
  openPanel.set(panel);
}

export function returnFocus(event: Event) {
  event.preventDefault();
  opener?.focus();
}
