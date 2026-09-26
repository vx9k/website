"use client";

import { localeKeys, locales, type Locale } from "../i18n/locales";

// Plain links to each copy of the site, so they work without JavaScript.
// With it, the choice is remembered in a cookie that both the Worker at
// "/" and the 404 page read.
function remember(lang: Locale) {
  document.cookie = `vx-lang=${lang}; path=/; max-age=31536000; samesite=lax; secure`;
}

export default function LanguageLinks({ lang, label }: { lang: Locale; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="-me-3.5 flex">
        {localeKeys.map((l) => (
          <li key={l}>
            <a
              href={`/${l}`}
              hrefLang={locales[l].tag}
              lang={locales[l].tag}
              aria-current={l === lang ? "page" : undefined}
              onClick={() => remember(l)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-xs text-muted decoration-signal decoration-2 underline-offset-8 hover:text-fg aria-[current=page]:text-fg aria-[current=page]:underline"
            >
              {locales[l].short}
              <span className="sr-only"> {locales[l].name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
