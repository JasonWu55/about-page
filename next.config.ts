import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/about-page",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
