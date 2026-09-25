import { links } from "../content";
import type { Dictionary } from "../i18n";
import Campfire from "./Campfire";

export default function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="shell pb-[env(safe-area-inset-bottom)]">
      <div className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rule-t py-4">
        <p className="flex items-center gap-3">
          <Campfire label={t.scene.fire} />
          © {new Date().getFullYear()} vx
        </p>
        <p>
          <a
            href={links.website}
            className="inline-flex min-h-11 items-center px-1 hover:bg-ink hover:text-bg"
          >
            {t.footer.source} ↗︎
          </a>
        </p>
      </div>
    </footer>
  );
}
