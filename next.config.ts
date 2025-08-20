import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'image.thum.io'],
  },
  // PWA features can be enabled later with proper configuration
};

export default nextConfig;
