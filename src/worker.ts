// Runs only for the site root (assets.run_worker_first in wrangler.jsonc);
// every other request is served straight from the static files in out/.
// It negotiates the page's format: a request whose Accept header prefers
// text/markdown gets out/index.md (src/app/index.md/route.ts), and
// everything else, browsers included, gets the HTML as before.

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

// The q-value a media range gets in an Accept header, or null if it isn't
// listed. "text/markdown;q=0.9" -> 0.9; a missing q is 1.
function quality(accept: string, type: string) {
  for (const part of accept.toLowerCase().split(",")) {
    const [range, ...params] = part.split(";").map((s) => s.trim());
    if (range !== type) continue;
    const q = params.find((p) => p.startsWith("q="));
    return q ? Number(q.slice(2)) || 0 : 1;
  }
  return null;
}

// Markdown only when it's asked for by name and HTML isn't preferred over
// it; a tie goes to Markdown, since naming it at all is the stronger hint.
// Browsers never list text/markdown, so they always get HTML.
function wantsMarkdown(accept: string | null) {
  if (!accept) return false;
  const md = quality(accept, "text/markdown");
  return md !== null && md > 0 && md >= (quality(accept, "text/html") ?? 0);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const markdown = wantsMarkdown(request.headers.get("accept"));
    const asset = await env.ASSETS.fetch(
      markdown ? new Request(new URL("/index.md", request.url), { method: "GET" }) : request,
    );
    const headers = new Headers(asset.headers);
    // Either answer depends on Accept, so caches keep the two apart.
    headers.append("vary", "accept");
    if (!markdown) return new Response(asset.body, { status: asset.status, headers });

    // Agents use the token count to budget their context. It's an estimate
    // (about four characters a token), not any one model's tokenizer.
    const text = await asset.text();
    headers.set("content-type", "text/markdown; charset=utf-8");
    headers.set("x-markdown-tokens", String(Math.ceil(text.length / 4)));
    headers.delete("content-length");
    return new Response(request.method === "HEAD" ? null : text, { status: asset.status, headers });
  },
};
