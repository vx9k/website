/** Four facts as a spec table: label-over-value cells divided by
 *  hairlines, two across on phones and four across from md up. The grid
 *  is pulled out by a pixel and clipped, so only the inner rules show;
 *  the caller gives the outer edge (glass, or a border). */
export default function Specs({ rows, className }: { rows: (readonly [string, string])[]; className: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <dl className="-m-px grid grid-cols-2 md:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k} className="border-t border-l border-line px-4 py-3">
            <dt className="label">{k}</dt>
            <dd className="mt-1.5">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
