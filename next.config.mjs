import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      // Contentlayer dynamic import / cache analysis warnings
      /@contentlayer\/core[\\/]dist[\\/]dynamic-build\.js/,
      /@contentlayer\/core[\\/]dist[\\/]getConfig[\\/]index\.js/,
      /@contentlayer\/core[\\/]dist[\\/]generation[\\/]generate-dotpkg\.js/
    ];
    return config;
  }
};

export default withContentlayer(nextConfig);
