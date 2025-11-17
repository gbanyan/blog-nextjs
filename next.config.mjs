import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  }
};

export default withContentlayer(nextConfig);
