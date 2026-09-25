import type { Metadata } from "next";
import "./globals.css";
import Scene from "./components/Scene";
import Screen from "./components/Screen";
import { bootScript, fontVariables } from "./document";
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
        <script dangerouslySetInnerHTML={{ __html: bootScript + pickScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip antialiased">
        <main id="main" className="console flex min-h-dvh flex-col justify-center py-6">
          <div className="notch bg-bezel p-[clamp(0.5rem,2vw,1.5rem)]">
            <Screen>
              {/* Same generator, another seed: different hills. */}
              <Scene seed={404} />
              <div className="art-inset pt-8 pb-12">
                {localeKeys.map((l) => {
                  const t = getDictionary(l).notFound;
                  return (
                    <div key={l} lang={locales[l].tag} className={visibility[l]}>
                      <p className="eyebrow">404</p>
                      <h1 className="mt-3 text-title font-semibold">{t.title}</h1>
                      <p className="mt-4 max-w-[34rem] text-pretty">{t.body}</p>
                      <a href={`/${l}`} className="btn mt-8">
                        <span aria-hidden>←</span> {t.back}
                      </a>
                    </div>
                  );
                })}
              </div>
            </Screen>
          </div>
        </main>
      </body>
    </html>
  );
}
