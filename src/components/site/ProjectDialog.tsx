import type { CSSProperties } from "react";
import type { Product } from "@/app/content";
import Sheet from "./Sheet";

/** One product, in the drawer its row in the panel opens: what it is, a
 *  few specifics, the facts (group, stack, status, licence), its links,
 *  and then its screenshots. */
export default function ProjectDialog({ product: p, index }: { product: Product; index: number }) {
  return (
    <Sheet id={`p-${p.id}`} eyebrow={`${String(index + 1).padStart(2, "0")} · ${p.kind}`} title={p.name}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <p className="text-pretty">{p.summary}</p>
          {p.notes.length > 0 && (
            <ul className="flex flex-col gap-2 text-muted">
              {p.notes.map((note) => (
                <li key={note} className="text-pretty">
                  {note}
                </li>
              ))}
            </ul>
          )}

          <dl className="grid gap-x-6 gap-y-2 border-t pt-4 sm:grid-cols-[7rem_1fr]">
            {p.group && (
              <>
                <dt className="label">Made at</dt>
                <dd>
                  <a href={p.group.href} className="link inline-flex min-h-6 items-center">
                    {p.group.name}
                    <span aria-hidden>&nbsp;↗</span>
                  </a>
                  , {p.group.role}
                </dd>
              </>
            )}
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
        </div>

        {!!p.images?.length && (
          <div className="flex flex-col gap-4">
            {p.images!.map((img, i) => {
              const set = (ext: string) => img.widths.map((w) => `${img.src}-${w}.${ext} ${w}w`).join(", ");
              const sizes = "(min-width: 48rem) 42rem, 100vw";
              return (
                // next/image can't optimise a static export, so each
                // screenshot is pre-sized in AVIF with a WebP fallback.
                // Lazy images in a closed dialog load when it opens.
                <picture key={img.src} className="shot block overflow-hidden border border-rule bg-background" style={{ "--i": i } as CSSProperties}>
                  <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
                  <img
                    src={`${img.src}-${img.widths.at(-1)}.webp`}
                    srcSet={set("webp")}
                    sizes={sizes}
                    width={img.width}
                    height={img.height}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </picture>
              );
            })}
          </div>
        )}
      </div>
    </Sheet>
  );
}
