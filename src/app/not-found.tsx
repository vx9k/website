import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

// Exported as 404.html, which Cloudflare serves with a 404 status for any
// path that isn't a file (not_found_handling in wrangler.jsonc).
export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-dvh flex-col justify-center gap-6 py-16">
      <p className="label">404</p>
      <h1 className="max-w-[18ch] text-display text-balance">Page not found</h1>
      <p className="max-w-[52ch] text-muted text-pretty">
        There’s no page at this address. The link may be old, or the URL may have a typo.
      </p>
      <p>
        <a href="/" className="link inline-flex min-h-6 items-center">
          Back to the home page
        </a>
      </p>
    </main>
  );
}
