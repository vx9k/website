export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-2 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} vx</p>
        <p>Static · works offline · no trackers</p>
      </div>
    </footer>
  );
}
