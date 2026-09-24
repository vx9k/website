import SettingsToggle from "./SettingsToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-hairline px-5 py-5 sm:px-10 lg:px-10">
      <a href="#top" className="font-mono text-sm text-ink">
        vx
      </a>
      <SettingsToggle />
    </header>
  );
}
