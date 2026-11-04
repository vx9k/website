import type { CSSProperties } from "react";
import Frame from "@/components/site/Frame";
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

// One screen: who vx is and the work in the panel, the scene beside it,
// and everything else in dialogs.
export default function Home() {
  return (
    <>
      <Frame
        nav={
          <>
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
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="rise label flex items-center gap-2.5 text-foreground" style={order(1)}>
            {/* One pixel of the sun, the accent's mark for what's live. */}
            <span aria-hidden className="size-2 bg-accent" />
            {intro.status}
          </p>
          <h1 className="rise text-display text-balance" style={order(2)}>
            {intro.line}
          </h1>
          <p className="rise lede text-muted text-pretty" style={order(3)}>
            {intro.lede}
          </p>
          {/* Where the panel has room, it answers "how do I reach you"
              without a click; elsewhere Contact is in the header. */}
          <ul className="rise reach mt-2 flex-wrap gap-x-6 gap-y-1" style={order(4)}>
            <li>
              <a href={`mailto:${contact.email}`} className="link inline-flex min-h-6 items-center">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={site.github} className="link inline-flex min-h-6 items-center">
                GitHub<span aria-hidden>&nbsp;↗</span>
              </a>
            </li>
          </ul>
        </div>

        <section aria-labelledby="work-title" className="flex flex-col gap-2">
          <h2 id="work-title" className="rise label" style={order(5)}>
            Work
          </h2>
          <ul className="work">
            {products.map((p, i) => (
              <li key={p.id} className="rise flex" style={order(6 + i)}>
                <button type="button" {...opens(`p-${p.id}`)} aria-haspopup="dialog" className="row">
                  <span aria-hidden className="label row-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="row-name">{p.name}</span>
                  <span className="label row-kind">{p.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </Frame>

      {products.map((p, i) => (
        <ProjectDialog key={p.id} product={p} index={i} />
      ))}

      <Sheet id="skills" eyebrow="What I work with" title="Skills">
        <dl className="grid gap-8 sm:grid-cols-2">
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
