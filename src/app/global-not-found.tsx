import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./document";
import { getDictionary, localeKeys, locales } from "./i18n";

export { viewport } from "./document";

// A title that reads the same in every language, so it never disagrees
// with the copy the script below picks.
export const metadata: Metadata = { title: "404 · vx" };

// Exported as 404.html, which Cloudflare serves for any unknown path, so it
// can't know the language on the server. It carries all three copies and
// this script picks one before paint: the language in the URL (/es/…), the
// choice saved in the vx-lang cookie, then the browser's languages.
// Without JavaScript, English.
const pickScript = `(function () {
  var known = ${JSON.stringify(localeKeys)};
  var tags = ${JSON.stringify(Object.fromEntries(localeKeys.map((l) => [l, locales[l].tag])))};
  function pick() {
    var seg = location.pathname.split("/")[1];
    if (known.indexOf(seg) >= 0) return seg;
    var saved = document.cookie.match(/(?:^|;\\s*)vx-lang=([a-z]+)/);
    if (saved && known.indexOf(saved[1]) >= 0) return saved[1];
    var langs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var p = String(langs[i]).toLowerCase().split("-")[0];
      if (known.indexOf(p) >= 0) return p;
    }
    return "en";
  }
  var l = pick();
  var d = document.documentElement;
  d.setAttribute("data-lang", l);
  d.lang = tags[l];
})();`;

// Only the chosen language shows; English is the no-JS default.
const visibility = {
  en: "in-data-[lang=es]:hidden in-data-[lang=pt]:hidden",
  es: "hidden in-data-[lang=es]:block",
  pt: "hidden in-data-[lang=pt]:block",
};

export default function GlobalNotFound() {
  return (
    <html lang="en-US" dir="ltr" suppressHydrationWarning className={`${fontVariables} not-found`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip antialiased">
        <main id="main" className="shell flex min-h-dvh flex-col justify-center py-16">
          {localeKeys.map((l) => {
            const t = getDictionary(l).notFound;
            return (
              <div key={l} lang={locales[l].tag} className={`glass max-w-[48rem] p-6 sm:p-10 ${visibility[l]}`}>
                <p className="label flex items-center gap-2.5">
                  <span aria-hidden className="size-2 rounded-[1px] bg-signal" />
                  404
                </p>
                <h1 className="mt-6 max-w-[16ch] text-display font-medium text-balance wrap-break-word">{t.title}</h1>
                <p className="mt-8 max-w-[36rem] text-lg text-muted text-pretty">{t.body}</p>
                <a href={`/${l}`} className="btn mt-12">
                  <span aria-hidden>←</span> {t.back}
                </a>
              </div>
            );
          })}
        </main>
      </body>
    </html>
  );
}
