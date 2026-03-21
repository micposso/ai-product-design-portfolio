/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  transpilePackages: ["streamdown", "shiki"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
