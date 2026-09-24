export default function About() {
  return (
    <section className="border-b border-hairline px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-mono text-sm text-muted">About</h2>
        <p className="mt-8 max-w-2xl font-sans text-xl leading-9 text-foreground sm:text-2xl sm:leading-10">
          I care more about a system still working in ten years than about
          shipping the fastest possible version of it today. That means
          reading the standard before reaching for a library, and choosing
          the boring, well-specified interface over the clever one.
        </p>
      </div>
    </section>
  );
}
