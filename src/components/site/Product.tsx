import type { Product as ProductData } from "@/app/content";

/** One product: its name and what it is, a few specifics, the facts in a
 *  list (stack, status, licence), its links, and a screenshot when the
 *  repository has one. */
export default function Product({ product: p, index }: { product: ProductData; index: number }) {
  const titleId = `${p.id}-title`;
  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <p aria-hidden className="label">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 id={titleId} className="text-title">
          {p.name}
        </h3>
        <p className="max-w-[60ch] text-pretty">{p.summary}</p>
      </header>

      {p.notes.length > 0 && (
        <ul className="flex max-w-[60ch] flex-col gap-2 text-muted">
          {p.notes.map((note) => (
            <li key={note} className="text-pretty">
              {note}
            </li>
          ))}
        </ul>
      )}

      <dl className="grid gap-x-8 gap-y-3 border-t pt-5 sm:grid-cols-[8rem_1fr]">
        <dt className="label">Built with</dt>
        <dd>{p.stack.join(", ")}</dd>
        <dt className="label">Status</dt>
        <dd>{p.status}</dd>
        <dt className="label">License</dt>
        <dd>{p.license}</dd>
      </dl>

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <a href={p.repo} className="link inline-flex min-h-6 items-center">
            Repository<span className="sr-only"> for {p.name}</span>
            <span aria-hidden>&nbsp;↗</span>
          </a>
        </li>
        {p.live && (
          <li>
            <a href={p.live.href} className="link inline-flex min-h-6 items-center">
              {p.live.label}
              <span aria-hidden>&nbsp;↗</span>
            </a>
          </li>
        )}
      </ul>

      {p.image && (
        // next/image can't optimise a static export, so each screenshot
        // is pre-sized in AVIF with a WebP fallback (public/work/).
        <picture className="shot block overflow-hidden border bg-surface">
          <source
            type="image/avif"
            srcSet={`${p.image.src}-640.avif 640w, ${p.image.src}-1280.avif 1280w`}
            sizes="(min-width: 72rem) 52rem, (min-width: 48rem) 75vw, 100vw"
          />
          <img
            src={`${p.image.src}-1280.webp`}
            srcSet={`${p.image.src}-640.webp 640w, ${p.image.src}-1280.webp 1280w`}
            sizes="(min-width: 72rem) 52rem, (min-width: 48rem) 75vw, 100vw"
            width={p.image.width}
            height={p.image.height}
            alt={p.image.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      )}
    </article>
  );
}
