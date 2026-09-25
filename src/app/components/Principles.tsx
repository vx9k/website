import Reveal from "./Reveal";

const principles = [
  {
    title: "Standards over shortcuts",
    body: "POSIX interfaces over vendor extensions. If a program only runs on one platform, that's a design decision worth questioning.",
  },
  {
    title: "One job, done predictably",
    body: "An init that only manages processes. A service manager that only manages services. Scope creep is usually the first sign something's about to become unreliable.",
  },
  {
    title: "Small enough to understand fully",
    body: "Code you can hold in your head beats code you have to trust. If I can't explain why a line is there, it doesn't stay.",
  },
];

const delays = ["", "delay-100", "delay-200"];

export default function Principles() {
  return (
    <section id="principles" className="scroll-mt-24 py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {principles.map((p, i) => (
          <Reveal key={p.title} className={`glass rounded-2xl p-6 ${delays[i]}`}>
            <h3 className="font-[family-name:var(--font-display)] text-xl leading-snug">
              {p.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-muted">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
