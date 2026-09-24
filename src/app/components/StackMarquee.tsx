const stack = [
  "C",
  "POSIX",
  "Linux",
  "BSD",
  "Make",
  "Git",
  "Bash",
];

export default function StackMarquee() {
  return (
    <section className="border-b border-hairline py-8">
      <div className="flex overflow-hidden select-none">
        {/* We render two identical tracks side-by-side */}
        <div className="flex shrink-0 min-w-full justify-around gap-12 font-mono text-sm text-muted animate-marquee">
          {stack.map((item, i) => (
            <span key={`1-${item}-${i}`} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 min-w-full justify-around gap-12 font-mono text-sm text-muted animate-marquee" aria-hidden="true">
          {stack.map((item, i) => (
            <span key={`2-${item}-${i}`} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
