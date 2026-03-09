import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/showcase',
        destination: '/?demo=active',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-940e42d6aeea403e9c1c9e8d91684329.r2.dev',
      },
    ],
  },
};

export default nextConfig;
