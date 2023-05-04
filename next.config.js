/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.novelai.net/",
      },
      {
        source: "/api/match",
        destination: "https://api.novelai.net/ai/generate",
      },
      {
        source: "/",
        destination: "https://api.novelai.net/ai/generate",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL_IMG,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
