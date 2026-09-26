import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./document";
import { getDictionary, localeKeys, locales } from "./i18n";

export { viewport } from "./document";

export const metadata: Metadata = { title: "Page not found · vx" };

// Exported as 404.html, which Cloudflare serves for any unknown path, so it
// can't know the language on the server. It carries all three copies and
// this script picks one before paint: the language in the URL (/es/…), a
// saved choice, then the browser's languages. Without JavaScript, English.
const pickScript = `(function () {
  var known = ${JSON.stringify(localeKeys)};
  var tags = ${JSON.stringify(Object.fromEntries(localeKeys.map((l) => [l, locales[l].tag])))};
  var titles = ${JSON.stringify(Object.fromEntries(localeKeys.map((l) => [l, getDictionary(l).notFound.title + " · vx"])))};
  function pick() {
    var seg = location.pathname.split("/")[1];
    if (known.indexOf(seg) >= 0) return seg;
    try { var saved = localStorage.getItem("vx-lang"); if (known.indexOf(saved) >= 0) return saved; } catch (e) {}
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
  document.title = titles[l];
  // Hydration writes metadata.title (English) back into <head>; undo it.
  new MutationObserver(function () {
    if (document.title !== titles[l]) document.title = titles[l];
  }).observe(document.head, { subtree: true, childList: true, characterData: true });
})();`;

// Only the chosen language shows; English is the no-JS default.
const visibility = {
  en: "in-data-[lang=es]:hidden in-data-[lang=pt]:hidden",
  es: "hidden in-data-[lang=es]:block",
  pt: "hidden in-data-[lang=pt]:block",
};

export default function GlobalNotFound() {
  return (
    <html lang="en-US" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip antialiased">
        <main id="main" className="shell flex min-h-dvh flex-col justify-center py-16">
          {localeKeys.map((l) => {
            const t = getDictionary(l).notFound;
            return (
              <div key={l} lang={locales[l].tag} className={visibility[l]}>
                <p className="label flex items-center gap-2.5">
                  <span aria-hidden className="size-2 bg-signal" />
                  404
                </p>
                <h1 className="mt-6 max-w-[16ch] text-display font-medium text-balance wrap-break-word">{t.title}</h1>
                <p className="mt-8 max-w-[34rem] text-lg text-muted text-pretty">{t.body}</p>
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
