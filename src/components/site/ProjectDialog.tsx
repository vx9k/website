import type { CSSProperties } from "react";
import type { Product } from "@/app/content";
import { day, statsFor } from "@/app/github";
import Sheet from "./Sheet";

const plural = (n: number, one: string) => `${n.toLocaleString("en-US")} ${one}${n === 1 ? "" : "s"}`;

/** One product, in the drawer its entry in the strip opens: what it is, a
 *  few specifics, the facts (group, stack, status, licence, and what
 *  GitHub last reported for it), its links, and then its screenshots. */
export default function ProjectDialog({ product: p }: { product: Product }) {
  const live = statsFor(p.repo);
  return (
    <Sheet id={`p-${p.id}`} title={p.name} sub={p.kind}>
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

          <dl className="grid gap-x-6 gap-y-2 border-t pt-4 sm:grid-cols-[8.5rem_1fr]">
            {p.group && (
              <>
                <dt className="label">Made at</dt>
                <dd>
                  <a href={p.group.href} className="link inline-flex min-h-6 items-center">
                    {p.group.name}
                  </a>
                  , {p.group.role}
                </dd>
              </>
            )}
            {live && (
              <>
                <dt className="label">On GitHub</dt>
                <dd>
                  {plural(live.commits, "commit")} by vx, {plural(live.stars, "star")}
                  {live.pushed && <>, last pushed {day(live.pushed)}</>}
                </dd>
              </>
            )}
            {live?.release && (
              <>
                <dt className="label">Latest release</dt>
                <dd>
                  <a href={live.release.url} className="link inline-flex min-h-6 items-center">
                    {live.release.tag}
                  </a>
                  {live.release.date && <>, {day(live.release.date)}</>}
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
                
              </a>
            </li>
            {p.live && (
              <li>
                <a href={p.live.href} className="link inline-flex min-h-6 items-center">
                  {p.live.label}
                  
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
                <picture key={img.src} className="shot block overflow-hidden border" style={{ "--i": i } as CSSProperties}>
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
