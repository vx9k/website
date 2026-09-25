import { bootLog } from "../content";

const TAGS = {
  OK: { label: "  OK  ", tone: "text-moss" },
  WIP: { label: " WIP  ", tone: "text-ink" },
  "--": { label: "  --  ", tone: "text-faint" },
  "": { label: "  ..  ", tone: "text-faint" },
} as const;

// A stylised boot of 4suite. The lines are printed one by one with CSS
// only; screen readers get the plain-language summary in the caption.
export default function BootLog() {
  const last = bootLog.length;

  return (
    <figure
      className="rise glass ticks isolate self-start"
      style={{ ["--i" as string]: 3 }}
    >
      <figcaption className="eyebrow flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="size-1.5 bg-moss" />
          tty1 / 4suite boot
        </span>
        <span aria-hidden className="text-faint">
          dmesg
        </span>
        <span className="sr-only">
          : 4init starts as process 1, routes signals to a signalfd, launches
          the 4rc service manager in its own session and reaps finished child
          processes. 4rc is in progress; logger and user are planned.
        </span>
      </figcaption>
      <pre
        aria-hidden
        className="px-5 py-5 font-mono text-[0.76rem] leading-[1.9] whitespace-pre-wrap text-muted sm:text-[0.8rem]"
      >
        {bootLog.map((line, i) => {
          const tag = TAGS[line.tag];
          return (
            <span
              key={line.text}
              className="boot-line block pl-[9ch] -indent-[9ch]"
              style={{ ["--i" as string]: i }}
            >
              <span className="text-faint">[</span>
              <span className={tag.tone}>{tag.label}</span>
              <span className="text-faint">]</span> {line.text}
            </span>
          );
        })}
        <span
          className="boot-line mt-3 block text-ink"
          style={{ ["--i" as string]: last }}
        >
          <span className="text-moss">vx@tty1</span>
          <span className="text-faint">:</span>~$ <span
            className="cursor inline-block h-[1.1em] w-[0.6ch] translate-y-[0.2em] bg-moss"
            style={{ ["--i" as string]: last }}
          />
        </span>
      </pre>
    </figure>
  );
}
