export default function SectionHeading({
  id,
  index,
  kicker,
  title,
  aside,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  aside?: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
      <div>
        <p className="eyebrow">
          <span className="text-moss">{index}</span>
          <span aria-hidden className="px-2 text-faint">
            /
          </span>
          {kicker}
        </p>
        <h2
          id={id}
          className="mt-4 font-display text-title font-[430] tracking-[-0.02em] text-balance"
          style={{ fontVariationSettings: '"SOFT" 30, "opsz" 96' }}
        >
          {title}
        </h2>
      </div>
      {aside && (
        <p className="max-w-sm text-pretty text-muted md:pb-1.5 md:text-right">
          {aside}
        </p>
      )}
    </div>
  );
}
