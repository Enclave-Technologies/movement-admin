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
            {
                protocol: "https",
                hostname: "cloud.appwrite.io",
                port: "",
                pathname: "/v1/storage/buckets/670e9315002c28a700c7/files/**/*",
            },
        ],
    },
};

export default nextConfig;
