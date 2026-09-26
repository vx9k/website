/** Four facts as a spec sheet: label-over-value cells on hairlines, two
 *  across on phones and four across from md up. */
export default function Specs({ rows, className = "" }: { rows: (readonly [string, string])[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 md:grid-cols-4 ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3 pb-5">
          <dt className="label">{k}</dt>
          <dd className="mt-2">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
