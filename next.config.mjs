/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/sonance",
  assetPrefix: "/sonance/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
