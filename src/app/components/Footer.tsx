import { links } from "../content";
import type { Dictionary } from "../i18n";
import Campfire from "./Campfire";

export default function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="shell pb-[env(safe-area-inset-bottom)]">
      <div className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-6">
        <p className="flex items-center gap-3">
          {/* 7×8 art pixels at 4px each. */}
          <Campfire className="h-[32px] w-[28px]" />
          © {new Date().getFullYear()} vx
        </p>
        <p>
          <a
            href={links.website}
            className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-ember"
          >
            {t.footer.source} ↗︎
          </a>
        </p>
      </div>
    </footer>
  );
}
