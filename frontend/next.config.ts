import type { NextConfig } from "next";

const api = process.env.API_URL || "http://backend:8000"
console.log(1111, api)
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match all requests to /api
        destination: `${api}/api/:path*`, // The Express backend URL
      },
    ];
  },
};

export default nextConfig;
