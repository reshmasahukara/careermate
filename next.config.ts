import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/roadmap",
        destination: "/career-pathways",
        permanent: true,
      },
      {
        source: "/roadmap/:path*",
        destination: "/career-pathways/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
