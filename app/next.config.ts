import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['github.com'], // Add other domains as needed
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  staticPageGenerationTimeout: 120,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
