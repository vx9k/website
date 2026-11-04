import type { Metadata } from "next";
import Horizon from "@/components/site/Horizon";
import { MotionScript, MotionToggle } from "@/components/site/Motion";

export const metadata: Metadata = { title: "Page not found" };

// Exported as 404.html, which Cloudflare serves with a 404 status for any
// path that isn't a file (not_found_handling in wrangler.jsonc). The same
// scene and motion switch as the home page.
export default function NotFound() {
  return (
    <>
      <div className="relative z-[1] flex min-h-dvh flex-col">
        <header className="shell flex min-h-16 items-center justify-end pt-2">
          <MotionToggle />
        </header>
        <MotionScript />
        <main id="main" className="shell flex flex-1 flex-col justify-center gap-6 pb-[40vh]">
          <p className="rise label">
            404
          </p>
          <h1 className="rise max-w-[18ch] text-display text-balance">Page not found</h1>
          <p className="rise max-w-[52ch] text-pretty">There’s no page at this address. The link may be old, or the URL may have a typo.</p>
          <p className="rise">
            <a href="/" className="link inline-flex min-h-6 items-center">
              Back to the home page
            </a>
          </p>
        </main>
      </div>
      <Horizon />
    </>
  );
}
