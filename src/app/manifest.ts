import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "vx — systems engineer",
    short_name: "vx",
    description:
      "vx writes minimal init systems and boot tooling in C, small enough to read in one sitting.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0808",
    theme_color: "#0c0808",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
