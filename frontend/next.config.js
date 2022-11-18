/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;
