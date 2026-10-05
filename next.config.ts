import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // This workspace’s AGENTS.md is a read-only synced project reference.
  agentRules: false,
};

export default nextConfig;
