import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Ignore TypeScript errors during build for now
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
