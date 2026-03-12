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
        hostname: "siddikiaprokashoni.cloud",
      },
      {
        protocol: "https",
        hostname: "siddikiaprokashoni.cloud",
      },
      {
        protocol: "http",
        hostname: "api.siddikiaprokashoni.cloud",
      },
      {
        protocol: "https",
        hostname: "api.siddikiaprokashoni.cloud",
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
    ],
  },
};

export default nextConfig;
