import type { CSSProperties } from "react";
import Horizon from "@/components/site/Horizon";
import Mark from "@/components/site/Mark";
import { MotionScript, MotionToggle } from "@/components/site/Motion";
import ProjectDialog from "@/components/site/ProjectDialog";
import Sheet, { opens } from "@/components/site/Sheet";
import { contact, intro, products, site, skills } from "./content";

// Structured data for search engines: vx, and the products as vx's work
// (or, for group work, the group's, with vx as a contributor).
// It's a data block, not a script, so the CSP doesn't apply to it; "<" is
// escaped so nothing in it can close the tag.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: site.name,
    jobTitle: "Software engineer",
    url: site.url,
    email: `mailto:${contact.email}`,
    sameAs: [site.github],
    address: { "@type": "PostalAddress", addressCountry: "UY" },
  },
  hasPart: products.map((p) => ({
    "@type": "SoftwareSourceCode",
    name: p.name,
    description: p.summary,
    codeRepository: p.repo,
    programmingLanguage: p.stack[0],
    license: `https://spdx.org/licenses/${p.license}`,
    ...(p.group
      ? {
          author: { "@type": "Organization", name: p.group.name, url: p.group.href },
          contributor: { "@type": "Person", name: site.name },
        }
      : { author: { "@type": "Person", name: site.name } }),
  })),
}).replace(/</g, "\\u003c");

// The order things rise in on load (.rise in globals.css).
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// One screen, no scrolling: who vx is over the dark sky, the work along
// the bottom over the water, and everything else in dialogs. The scene
// sits behind it all.
export default function Home() {
  return (
    <>
      <div className="relative z-[1] flex min-h-dvh flex-col">
        <header className="rise shell flex min-h-16 items-center justify-between gap-4 pt-2" style={order(0)}>
          <a href="/" className="inline-flex min-h-10 items-center gap-2.5 font-mono text-sm">
            <Mark size={22} flag id="mark-header" />
            vx
          </a>
          <nav aria-label="More">
            <ul className="flex items-center gap-4 sm:gap-7">
              <li>
                <button type="button" {...opens("skills")} aria-haspopup="dialog" className="nav">
                  Skills
                </button>
              </li>
              <li>
                <button type="button" {...opens("contact")} aria-haspopup="dialog" className="nav">
                  Contact
                </button>
              </li>
              <li>
                <MotionToggle />
              </li>
            </ul>
          </nav>
        </header>
        <MotionScript />

        <main id="main" tabIndex={-1} className="shell flex flex-1 flex-col justify-between gap-8 pt-3 pb-4 focus:outline-none sm:pt-8 sm:pb-8 [@media(height<=800px)]:sm:pt-4">
          <div>
            <p className="rise label flex items-center gap-2.5 text-foreground" style={order(1)}>
              {/* One pixel of the sun: the accent's only mark on the page. */}
              <span aria-hidden className="size-2 bg-accent" />
              {intro.status}
            </p>
            <h1 className="rise mt-3 max-w-[26ch] text-display text-balance sm:mt-4" style={order(2)}>
              {intro.line}
            </h1>
            <p className="rise mt-4 max-w-[50ch] text-pretty sm:mt-5 sm:text-lg" style={order(3)}>
              {intro.lede}
            </p>
          </div>

          <section aria-labelledby="work-title">
            {/* A tab on the buttons' surface, so it reads over any sky. */}
            <h2 id="work-title" className="rise label inline-block border border-b-0 bg-surface px-3 py-1 text-foreground" style={order(4)}>
              Work
            </h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {products.map((p, i) => (
                <li key={p.id} className="rise flex" style={order(5 + i)}>
                  <button type="button" {...opens(`p-${p.id}`)} aria-haspopup="dialog" className="card">
                    <span aria-hidden className="label hidden sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{p.name}</span>
                    {/* Phones show the names alone, so the buttons leave the
                        sun in view; the dialog names the kind. */}
                    <span className="label hidden sm:block">{p.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <Horizon />

      {products.map((p, i) => (
        <ProjectDialog key={p.id} product={p} index={i} />
      ))}

      <Sheet id="skills" eyebrow="What I work with" title="Skills">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-2">
              <dt className="label">{g.group}</dt>
              {g.items.map((item) => (
                <dd key={item}>{item}</dd>
              ))}
            </div>
          ))}
        </dl>
      </Sheet>

      <Sheet id="contact" eyebrow="Get in touch" title={contact.heading}>
        <p className="max-w-[52ch] text-muted text-pretty">{contact.body}</p>
        <ul className="mt-6 flex flex-col gap-3 text-lg">
          <li>
            <a href={`mailto:${contact.email}`} className="link inline-flex min-h-6 items-center">
              {contact.email}
            </a>
          </li>
          <li>
            <a href={site.github} className="link inline-flex min-h-6 items-center">
              github.com/vx9k<span aria-hidden>&nbsp;↗</span>
            </a>
          </li>
          <li className="text-base text-muted">
            <a href={site.source} className="link inline-flex min-h-6 items-center">
              Source for this site<span aria-hidden>&nbsp;↗</span>
            </a>
          </li>
        </ul>
      </Sheet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
