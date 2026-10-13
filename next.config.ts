import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  experimental: {
    // The page's CSS is small, so it goes inline: no render-blocking
    // stylesheet request before first paint.
    inlineCss: true,
  },
};

export default nextConfig;
