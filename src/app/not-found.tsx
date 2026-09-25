import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

// Exported as 404.html, which Cloudflare serves for any unknown path.
export default function NotFound() {
  return (
    <main
      id="main"
      className="shell flex flex-1 items-center py-[max(3rem,env(safe-area-inset-top))]"
    >
      <div className="card w-full max-w-2xl p-6 sm:p-10">
        <a
          href="/"
          className="inline-flex min-h-11 items-center text-xl font-semibold tracking-[-0.06em] text-ink"
        >
          vx
        </a>

        <p className="eyebrow mt-10">
          <span className="text-ember">404</span>
          <span aria-hidden className="px-2 text-faint">
            /
          </span>
          Not found
        </p>
        <h1 className="mt-4 text-title font-medium">
          Page not found
        </h1>

        <p className="mt-6 max-w-lg leading-7 text-muted">
          Nothing lives at this address. The link may be old, or the URL may
          have a typo.
        </p>

        <a href="/" className="group btn btn-solid mt-10">
          Back to the home page
          <span
            aria-hidden
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←︎
          </span>
        </a>
      </div>
    </main>
  );
}
