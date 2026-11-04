import type { Metadata } from "next";
import Frame from "@/components/site/Frame";

export const metadata: Metadata = { title: "Page not found" };

// Exported as 404.html, which Cloudflare serves with a 404 status for any
// path that isn't a file (not_found_handling in wrangler.jsonc). The same
// screen as the home page, with the panel saying what happened.
export default function NotFound() {
  return (
    <Frame>
      <div className="flex flex-col gap-4">
        <p className="rise label">404</p>
        <h1 className="rise text-display text-balance">Page not found</h1>
        <p className="rise text-muted text-pretty">There’s no page at this address. The link may be old, or the URL may have a typo.</p>
        <p className="rise">
          <a href="/" className="link inline-flex min-h-6 items-center">
            Back to the home page
          </a>
        </p>
      </div>
    </Frame>
  );
}
