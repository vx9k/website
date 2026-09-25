const sections = [
  { pid: "0001", comm: "hero", href: "#top" },
  { pid: "0002", comm: "principles", href: "#principles" },
  { pid: "0003", comm: "work", href: "#works" },
  { pid: "0004", comm: "stack", href: "#stack" },
  { pid: "0005", comm: "about", href: "#about" },
];

export default function ProcessNav() {
  return (
    <nav
      aria-label="Section navigation"
      className="glass sticky top-24 mt-10 hidden self-start rounded-2xl p-4 lg:block"
    >
      <p className="font-mono text-[11px] text-muted">
        PID&nbsp;&nbsp;COMM&nbsp;&nbsp;&nbsp;&nbsp;STAT
      </p>
      <ul className="mt-3 space-y-2 border-t border-hairline pt-3">
        {sections.map((s) => (
          <li key={s.pid}>
            <a
              href={s.href}
              className="group flex items-center gap-2 font-mono text-[11px] text-muted transition-colors hover:text-moss"
            >
              <span>{s.pid}</span>
              <span className="text-ink group-hover:text-moss">
                {s.comm}
              </span>
              <span className="ml-auto">R</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
