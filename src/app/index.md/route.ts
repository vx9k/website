import { contact, intro, products, sections, site, skills } from "../content";

// The page as Markdown, for agents: src/worker.ts serves it at "/" to
// requests that ask for text/markdown, and it's also at /index.md. It's
// written from the same content as the page, so the two can't drift.
export const dynamic = "force-static";

const title = (id: (typeof sections)[number]["id"]) => sections.find((s) => s.id === id)!.title;

function markdown() {
  const lines = [`# ${site.title}`, "", intro.status, "", intro.line, "", intro.lede, "", `## ${title("work")}`];

  for (const p of products) {
    lines.push("", `### ${p.name}`, "", p.summary);
    if (p.notes.length) lines.push("", ...p.notes.map((note) => `- ${note}`));
    // The facts as one paragraph with hard line breaks, so they don't run
    // into the notes' list above them.
    const facts = [
      `Built with: ${p.stack.join(", ")}`,
      `Status: ${p.status}`,
      `License: ${p.license}`,
      `Repository: <${p.repo}>`,
    ];
    if (p.live) facts.push(`Live: [${p.live.label}](${p.live.href})`);
    lines.push("", facts.join("\\\n"));
    if (p.image) lines.push("", `![${p.image.alt}](${site.url}${p.image.src}-1280.webp)`);
  }

  lines.push("", `## ${title("skills")}`);
  for (const g of skills) lines.push("", `### ${g.group}`, "", ...g.items.map((item) => `- ${item}`));

  lines.push(
    "",
    `## ${title("contact")}`,
    "",
    contact.heading,
    "",
    contact.body,
    "",
    `- Email: <mailto:${contact.email}>`,
    `- GitHub: <${site.github}>`,
    `- Source for this site: <${site.source}>`,
  );

  return lines.join("\n") + "\n";
}

export function GET() {
  return new Response(markdown(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
