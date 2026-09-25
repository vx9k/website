import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  reactCompiler: true,
  experimental: {
    inlineCss: true,
    useOffline: true,
    // The root layout sits under app/[lang], so the 404 for unmatched
    // URLs is app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
