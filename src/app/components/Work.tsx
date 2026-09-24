const projects = [
  {
    name: "genpasswd [archived]",
    year: "2025",
    description:
      "A cryptographically secure password generator, using libsodium, purely in C.",
    tags: ["C", "POSIX"],
  },
];

export default function Work() {
  return (
    <section className="border-b border-hairline px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-mono text-sm text-muted">Selected work</h2>

        <div className="mt-8 border-t border-hairline">
          {projects.map((project) => (
            <div
              key={project.name}
              className="flex flex-col gap-3 border-b border-hairline py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="sm:w-1/3">
                <h3 className="font-mono text-base text-foreground">
                  {project.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {project.year}
                </p>
              </div>
              <div className="sm:w-2/3">
                <p className="font-sans text-base leading-7 text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-signal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
