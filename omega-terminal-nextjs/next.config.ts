import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optimize package imports for large packages
  experimental: {
    optimizePackageImports: ["@solana/web3.js", "ethers"],
  },

  // Image optimization configuration
  images: {
    domains: [],
  },

  // TypeScript and ESLint configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
