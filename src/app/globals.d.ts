export {};

declare global {
  interface Window {
    /** Set by the boot script in layout.tsx. */
    __vxFlags?: {
      read: () => Partial<Record<"contrast" | "motion" | "eink" | "large", boolean>>;
      apply: () => void;
    };
  }
}
