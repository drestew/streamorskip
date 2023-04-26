/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.nflxso.net',
      },
      {
        protocol: 'http',
        hostname: '**.nflxso.net',
      },
      {
        protocol: 'http',
        hostname: '**.nflximg.net',
      },
      {
        protocol: 'https',
        hostname: '**.nflximg.net',
      },
    ],
  },
};

module.exports = nextConfig;
