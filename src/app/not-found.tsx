import type { Metadata } from "next";
import Frame from "@/components/site/Frame";

export const metadata: Metadata = { title: "Page not found" };

// Exported as 404.html, which Cloudflare serves with a 404 status for any
// path that isn't a file (not_found_handling in wrangler.jsonc). The same
// poster as the home page, the slogan saying what happened.
export default function NotFound() {
  return (
    <Frame slogan="Page not found.">
      <div className="about rise">
        <p className="lede">There’s no page at this address. The link may be old, or the URL may have a typo.</p>
        <p>
          <a href="/" className="link inline-flex min-h-6 items-center">
            Back to the home page
          </a>
        </p>
      </div>
    </Frame>
  );
}
