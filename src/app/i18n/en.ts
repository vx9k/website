// English (US). This file is the source of truth: the other dictionaries
// are typed against it, so a missing or extra key fails the build.
const en = {
  meta: {
    title: "vx — software engineer",
    description: "vx is based in Uruguay and writes C for Linux and TypeScript for the web.",
  },
  skip: "Skip to content",
  nav: {
    label: "Sections",
    language: "Language",
    skills: "Skills",
    principles: "Principles",
    contact: "Contact",
  },
  hero: {
    // vx's GitHub profile is marked available for hire.
    status: "Open to work",
    // From vx's GitHub profile (Software Engineer, Uruguay) and public
    // repos: 4init is a minimal PID 1.
    line: "I’m vx, a software engineer based in Uruguay.",
    lede: "I write C for Linux, down to PID 1, and TypeScript for the web, like this site. I’m interested in how things work underneath, from network layers to language models.",
  },
  skills: {
    title: "Skills",
    groups: { languages: "Languages", web: "Web", networking: "Networking", ai: "AI" },
    // Names for the skills that have none in content.ts.
    names: { asm: "x86 Assembly", llm: "How LLMs work", ai: "Working with AI" },
    // The OSI layers each entry covers.
    notes: { l23: "Data link, network", l4: "Transport", l67: "Presentation, application" },
  },
  principles: {
    title: "Principles",
    quote: "Small programs that each do one job, use POSIX interfaces where they can, and stay short enough to read in one sitting.",
    items: [
      {
        title: "Standards over shortcuts",
        body: "POSIX interfaces over vendor extensions.",
      },
      {
        title: "One job, done predictably",
        body: "An init that only manages processes. A service manager that only manages services.",
      },
      {
        title: "Small enough to understand fully",
        body: "If I can’t explain why a line is there, it doesn’t stay.",
      },
    ],
  },
  contact: {
    title: "Contact",
    heading: "I’m open to work.",
    body: "My projects are public on GitHub.",
  },
  footer: {
    source: "Source for this site",
    top: "Back to top",
  },
  // The quantum layer: the branch map in the header and the effects
  // panel in the footer.
  quantum: {
    close: "Close",
    branches: {
      open: "Branches",
      title: "Branches",
      description: "Every place you’ve been on this page, splitting wherever you took a different path. Pick one to go back to it.",
      here: "You are here",
      top: "Introduction",
      choice: {
        start: "Arrival",
        nav: "Link",
        lang: "Language change",
        map: "Map jump",
        link: "Direct visit",
        time: "Time travel",
      },
    },
    effects: {
      open: "Effects",
      title: "Effects",
      description: "The visual effects on this page. Your choice is saved in this browser.",
      all: "All effects",
      reduced: "Your system asks for less motion, so the effects stay still.",
      items: {
        ghosts: {
          name: "Ghost previews",
          note: "Faint echoes of the parts of the page you haven’t opened yet.",
        },
        superposition: {
          name: "Superposition nav",
          note: "Each link in the header sits in a few faint places at once and collapses into one as your pointer comes near. On a touch screen, the first tap collapses a link and the second follows it.",
        },
        interference: {
          name: "Interference background",
          note: "Faint waves from three sources, bright where they add up and dark where they cancel. One follows your pointer, and each branch places the others.",
        },
        cursor: {
          name: "Probability cursor",
          note: "On a computer with a mouse, a cloud of where your pointer might be. A click collapses it to one point.",
        },
        entanglement: {
          name: "Entangled skills",
          note: "Skills come in pairs, like C and x86 Assembly. Point at or tap one and its partner answers, spinning the other way.",
        },
        orbital: {
          name: "Orbital",
          note: "On wide screens, beside the introduction, a hydrogen orbital drawn from its probability density. Each branch shows its own: 2p or one of two 3d.",
        },
        tunneling: {
          name: "Tunneling transitions",
          note: "Moving to another section passes through a barrier.",
        },
        time: {
          name: "Time travel",
          note: "The timeline in the header, and this page as it might have looked in each skill’s year.",
        },
      },
    },
    // The timeline: each skill's year (content.ts) and the event it
    // stands for, and the world the page turns into there.
    time: {
      open: "Timeline",
      title: "Timeline",
      description: "Each skill in the year it first appeared. Travel to one to see this page as it might have looked then. The content stays the same.",
      now: "Back to now",
      started: "vx starts using tech",
      events: {
        1972: "C, at Bell Labs",
        1978: "Intel’s 8086",
        1984: "The OSI model, published by ISO",
        1991: "Python 0.9.0, and the first description of HTML",
        1995: "JavaScript, announced by Netscape",
        1996: "CSS level 1, a W3C Recommendation",
        2004: "nginx’s first public release",
        2009: "Node.js’s first release",
        2012: "TypeScript’s first public release",
        2014: "nftables, merged into Linux 3.13",
        2016: "Next.js’s first release",
        2017: "The Transformer paper, “Attention Is All You Need”",
        2022: "ChatGPT’s release",
      },
      worlds: {
        teletype: "Teletype printout",
        terminal: "Video terminal",
        desktop: "Desktop",
        web1: "Early web",
        web2: "Web 2.0",
        flat: "Flat design",
        now: "Today",
      },
    },
  },
  notFound: {
    title: "Page not found",
    body: "There’s no page at this address. The link may be old, or the URL may have a typo.",
    back: "Back to the home page",
  },
};

export type Dictionary = typeof en;
export default en;
