export {};

type Flags = Partial<Record<"day" | "motion" | "large", boolean>>;

declare global {
  interface Window {
    /** Set by the boot script in document.ts. */
    __vxFlags?: {
      read: () => Flags;
      save: (flags: Flags) => void;
      apply: () => void;
    };
  }
}
