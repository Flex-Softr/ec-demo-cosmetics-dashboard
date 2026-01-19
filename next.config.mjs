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
        hostname: "api.norabd.com",
      },
      {
        protocol: "https",
        hostname: "api.norabd.com",
      },
    ],
  },
};

export default nextConfig;
