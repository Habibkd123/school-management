import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["moustache-dentist-twilight.ngrok-free.dev", "https://school-management-one-ivory.vercel.app/"],
  // Increase body size limit for file uploads (10MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/fees-collection",
        destination: "/fees-collection/collect-fees",
        permanent: false,
      },
      {
        source: "/academic",
        destination: "/academic/class-room",
        permanent: false,
      },
      {
        source: "/examination",
        destination: "/examination/exam",
        permanent: false,
      },
      {
        source: "/leave",
        destination: "/leave/apply",
        permanent: false,
      },
      {
        source: "/reports",
        destination: "/reports/fees-report",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
