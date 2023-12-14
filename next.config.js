/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sit.instructure.com"
      }
    ]
  }
};

module.exports = nextConfig;
