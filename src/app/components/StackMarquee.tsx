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
  const items = [...stack, ...stack];

  return (
    <section className="border-b border-hairline py-8">
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max gap-12 font-mono text-sm text-muted">
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
