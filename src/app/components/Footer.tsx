export default function Footer() {
  return (
    <footer className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="max-w-lg font-mono text-3xl leading-tight sm:text-4xl">
          Building something that needs to last? Let&apos;s talk.
        </h2>

        <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
          <a
            href="mailto:hello@example.com"
            className="border border-hairline px-5 py-3 text-foreground transition-colors hover:border-signal hover:text-signal"
          >
            dev@kthread.dev
          </a>
          <a
            href="https://github.com/vx9k"
            className="border border-hairline px-5 py-3 text-muted transition-colors hover:border-signal hover:text-signal"
          >
            github.com/vx9k
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-hairline pt-8 font-mono text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} vx</span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
