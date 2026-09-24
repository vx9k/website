import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  reactCompiler: true,
  experimental: {
    inlineCss: true,
    useOffline: true,
  },
};

export default nextConfig;
