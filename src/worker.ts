// Runs only for the site root (assets.run_worker_first in wrangler.jsonc);
// every other request is served straight from the static files in out/.
// It sends the visitor to one copy of the site: a language they chose
// before (the vx-lang cookie set by the header switch), else the first of
// their browser's Accept-Language that the site has, else English.

const known = ["en", "es", "pt"];

function fromCookie(header: string | null) {
  const match = header?.match(/(?:^|;\s*)vx-lang=([a-z]+)/);
  return match && known.includes(match[1]) ? match[1] : null;
}

// "pt-BR,pt;q=0.9,en;q=0.8" -> "pt". Highest q wins; ties keep header order.
function fromAcceptLanguage(header: string | null) {
  const ranked = (header ?? "")
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) : 1, i };
    })
    .filter((l) => l.q > 0 && known.includes(l.lang))
    .sort((a, b) => b.q - a.q || a.i - b.i);
  return ranked[0]?.lang ?? null;
}

export default {
  fetch(request: Request): Response {
    const lang =
      fromCookie(request.headers.get("cookie")) ??
      fromAcceptLanguage(request.headers.get("accept-language")) ??
      "en";

    return new Response(null, {
      status: 302,
      headers: {
        location: new URL(`/${lang}`, request.url).toString(),
        // The answer depends on the visitor, so no shared cache may keep it.
        "cache-control": "private, no-store",
        vary: "accept-language, cookie",
      },
    });
  },
};
