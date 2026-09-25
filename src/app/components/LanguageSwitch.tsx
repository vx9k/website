"use client";

import { localeKeys, locales, type Locale } from "../i18n/locales";

// Remembers an explicit choice so the site root stops guessing from the
// browser's languages on later visits. The Worker at "/" (src/worker.ts)
// reads the cookie; the 404 page reads localStorage.
function remember(lang: Locale) {
  document.cookie = `vx-lang=${lang}; path=/; max-age=31536000; samesite=lax; secure`;
  try {
    localStorage.setItem("vx-lang", lang);
  } catch {
    // Storage can be blocked; the link still works for this visit.
  }
}

/** Language links in the header. Each is a plain link to that copy of the
 *  site, so it works without JavaScript; with it, the choice is saved and
 *  the section you were reading carries over. */
export default function LanguageSwitch({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center">
        {localeKeys.map((l) => {
          const current = l === lang;
          const { tag, short, name } = locales[l];
          return (
            <li key={l}>
              <a
                href={`/${l}`}
                hrefLang={tag}
                lang={tag}
                aria-current={current ? "page" : undefined}
                onClick={(e) => {
                  remember(l);
                  if (!current) e.currentTarget.hash = window.location.hash;
                }}
                className={`relative inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-[0.75rem] font-medium tracking-[0.06em] transition-colors ${
                  current ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {short}
                <span className="sr-only"> {name}</span>
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-2 h-px bg-ember transition-opacity ${
                    current ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
