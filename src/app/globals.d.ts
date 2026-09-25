export {};

declare global {
  interface Window {
    /** Swaps day and night. Set by the boot script in document.ts. */
    vxTheme?: () => void;
  }
}
