"use client";

import { localeKeys, locales, type Locale } from "@/app/i18n/locales";

// Plain links to each copy of the site, so they work without JavaScript.
// With it, the choice is remembered in a cookie that both the Worker at
// "/" and the 404 page read. The classes come from the server (shadcn/ui's
// button variants), so cn() and tailwind-merge stay out of the browser.
function remember(lang: Locale) {
  document.cookie = `vx-lang=${lang}; path=/; max-age=31536000; samesite=lax; secure`;
}

export default function LanguageLinks({
  lang,
  label,
  current,
  other,
}: {
  lang: Locale;
  label: string;
  current: string;
  other: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-0.5 rounded-md border p-0.5">
        {localeKeys.map((l) => (
          <li key={l}>
            <a
              href={`/${l}`}
              hrefLang={locales[l].tag}
              lang={locales[l].tag}
              aria-current={l === lang ? "page" : undefined}
              onClick={() => remember(l)}
              className={l === lang ? current : other}
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
