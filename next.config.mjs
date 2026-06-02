/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "siddikiaprokashoni.com",
      },
      {
        protocol: "https",
        hostname: "siddikiaprokashoni.com",
      },
      {
        protocol: "http",
        hostname: "api.siddikiaprokashoni.com",
      },
      {
        protocol: "https",
        hostname: "api.siddikiaprokashoni.com",
      },
      {
        protocol: "https",
        hostname: "cdn.siddikiaprokashoni.com",
      },
    ],
  },
};

export default nextConfig;
