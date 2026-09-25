import Reveal from "./Reveal";

const stack = [
  "C",
  "TypeScript",
  "Next.js",
  "React",
  "Tailwind CSS",
  "clang-format",
  "pnpm",
  "Git",
];

export default function Stack() {
  return (
    <section id="stack" className="scroll-mt-24 py-10">
      <h2 className="font-mono text-sm text-muted">Stack</h2>
      <Reveal className="mt-4 flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="glass rounded-full px-3 py-1.5 font-mono text-xs text-muted"
          >
            {item}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
