import SettingsToggle from "./SettingsToggle";

export default function Header() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-10">
        <a href="#top" className="font-mono text-sm text-ink">
          vx
        </a>
        <SettingsToggle />
      </div>
    </header>
  );
}
