/** Four facts as a spec table: label-over-value cells divided by
 *  hairlines: one across on the narrowest phones (so a URL isn't clipped),
 *  two on phones and four from md up. The grid
 *  is pulled out by a pixel and clipped, so only the inner rules show;
 *  the caller gives the outer edge (a pane of glass, or rules above and
 *  below). */
export default function Specs({ rows, className }: { rows: (readonly [string, string])[]; className: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <dl className="-m-px grid grid-cols-1 min-[22rem]:grid-cols-2 md:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k} className="border-t border-l border-line px-4 py-3">
            <dt className="label">{k}</dt>
            <dd className="mt-1.5 text-pretty">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
