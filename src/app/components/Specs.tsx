/** Facts as a spec sheet: a row of cells, each a label over a value with
 *  a hairline on top. Cells wrap to as many columns as fit. */
export default function Specs({ rows, className = "" }: { rows: (readonly [string, string])[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-6 ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3 pb-5">
          <dt className="label">{k}</dt>
          <dd className="mt-2">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
