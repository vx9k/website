export default function Footer() {
  return (
    <footer className="border-t border-hairline px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted">
          <a
            href="https://github.com/vx9k"
            className="transition-colors hover:text-moss"
          >
            github.com/vx9k
          </a>
          <a
            href="https://kthread.dev"
            className="transition-colors hover:text-moss"
          >
            kthread.dev
          </a>
        </div>
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} vx
        </span>
      </div>
    </footer>
  );
}
