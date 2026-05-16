import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to silence workspace-root warning
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
