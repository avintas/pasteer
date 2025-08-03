import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization
    unoptimized: false,
    // Configure domains for external images (if needed in the future)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel-blob.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Set image formats for better performance
    formats: ['image/webp', 'image/avif'],
    // Configure device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configure output for Vercel
  output: 'standalone',
  // Disable static optimization for dynamic pages
  trailingSlash: false,
  // Ensure proper error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
