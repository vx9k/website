import Numogram from "@/components/site/Numogram";
import Product from "@/components/site/Product";
import Section from "@/components/site/Section";
import { contact, intro, products, sections, site, skills } from "./content";

// Structured data for search engines: vx, and the products as vx's work.
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
    author: { "@type": "Person", name: site.name },
  })),
}).replace(/</g, "\\u003c");

// One page: who vx is, the work, then how to get in touch.
export default function Home() {
  return (
    <>
      <header className="shell flex min-h-16 items-center justify-between gap-6 pt-2">
        <a href="/" className="inline-flex min-h-10 items-center font-mono text-sm">
          vx
        </a>
        <nav aria-label="Sections">
          <ul className="flex gap-5 sm:gap-7">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-10 items-center text-sm text-muted hover:text-foreground">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <div className="shell grid items-center gap-16 pt-20 pb-12 sm:pt-28 sm:pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="label flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-foreground forced-colors:bg-[CanvasText]" />
              {intro.status}
            </p>
            <h1 className="mt-6 max-w-[18ch] text-display text-balance">{intro.line}</h1>
            <p className="mt-8 max-w-[52ch] text-lg text-muted text-pretty sm:text-xl">{intro.lede}</p>
          </div>
          <Numogram className="mx-auto w-full max-w-56 sm:max-w-64 lg:col-span-4 lg:max-w-80" />
        </div>

        <Section id="work" title="Work">
          <div className="flex flex-col gap-24 sm:gap-32">
            {products.map((p, i) => (
              <Product key={p.id} product={p} index={i} />
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
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
        </Section>

        <Section id="contact" title="Contact">
          <p className="text-title text-balance">{contact.heading}</p>
          <p className="mt-4 max-w-[52ch] text-muted text-pretty">{contact.body}</p>
          <ul className="mt-8 flex flex-col gap-3 text-xl">
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
          </ul>
        </Section>
      </main>

      <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t py-8 text-sm text-muted">
        <p className="font-mono">vx</p>
        <a href={site.source} className="link inline-flex min-h-6 items-center">
          Source for this site<span aria-hidden>&nbsp;↗</span>
        </a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
