import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "vx — systems engineer",
    short_name: "vx",
    description:
      "vx is a systems engineer writing POSIX-minded software and minimal boot tooling in C.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b08",
    theme_color: "#070b08",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
