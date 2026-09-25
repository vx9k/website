import type { MetadataRoute } from "next";
import en from "./i18n/en";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.meta.title,
    short_name: "vx",
    description: en.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#5ab9a8",
    theme_color: "#5ab9a8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
