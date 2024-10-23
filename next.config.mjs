/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "movementfitnesshk.com",
        port: "",
        pathname: "/wp-content/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/8/8c/*",
      },
    ],
  },
};

export default nextConfig;
