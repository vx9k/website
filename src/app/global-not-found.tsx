import type { Metadata } from "next";
import "./globals.css";
import { bootScript, fontVariables } from "./document";
import PixelMark from "./components/PixelMark";
import PixelScene from "./components/PixelScene";
import { getDictionary, localeKeys, locales } from "./i18n";

export { viewport } from "./document";

export const metadata: Metadata = {
  title: "Page not found · vx",
};

// Exported as 404.html, which Cloudflare serves for any unknown path, so
// it can't know the language on the server. It carries all three copies
// and this script picks one before paint: the language in the URL (/es/…),
// then a saved choice, then the browser's languages. Without JavaScript,
// English shows.
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
})();`;

// Shown for the chosen language only; English is the no-JS default.
const visibility = {
  en: "block in-data-[lang=es]:hidden in-data-[lang=pt]:hidden",
  es: "hidden in-data-[lang=es]:block",
  pt: "hidden in-data-[lang=pt]:block",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en-US"
      dir="ltr"
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript + pickScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip text-ink antialiased">
        <main
          id="main"
          className="shell flex flex-1 items-center pt-[max(3rem,env(safe-area-inset-top))] pb-8"
        >
          {localeKeys.map((l) => {
            const t = getDictionary(l).notFound;
            return (
              <div key={l} className={`w-full max-w-2xl ${visibility[l]}`}>
                <a href={`/${l}`} className="inline-flex min-h-11 items-center">
                  <PixelMark className="h-[15px] w-[33px]" />
                  <span className="sr-only">vx</span>
                </a>

                <p className="eyebrow mt-10 flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 bg-ember" />
                  <span className="text-ember">404</span>
                  <span aria-hidden className="text-faint">
                    /
                  </span>
                  {t.eyebrow}
                </p>
                <h1 className="mt-4 text-title font-medium">{t.title}</h1>

                <p className="mt-6 max-w-lg leading-7 text-muted">{t.body}</p>

                <a href={`/${l}`} className="group btn btn-solid mt-10">
                  {t.back}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:-translate-x-0.5"
                  >
                    ←︎
                  </span>
                </a>
              </div>
            );
          })}
        </main>
        {/* A different range from the home page's: same generator, new seed. */}
        <PixelScene seed={404} className="aspect-[200/72] max-h-[28rem] min-h-44" />
      </body>
    </html>
  );
}
