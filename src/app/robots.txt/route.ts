import { site } from "../content";

// A route rather than robots.ts, because Next's robots type has no field
// for Content-Signal (contentsignals.org): search engines may index the
// site and AI tools may read it to answer a question, but it isn't
// offered as training data. public/_headers sends the same signal on
// every response.
export const dynamic = "force-static";

const robots = `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

export function GET() {
  return new Response(robots, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
