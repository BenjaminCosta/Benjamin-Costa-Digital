import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // This workspace’s AGENTS.md is a read-only synced project reference.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 50 for decorative glass backgrounds (shown faded and blended), 75 default.
    qualities: [50, 75],
  },
};

export default nextConfig;
