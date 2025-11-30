import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For demo seed data
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // For user uploaded images in the future
      }
    ],
  },
};

export default nextConfig;
