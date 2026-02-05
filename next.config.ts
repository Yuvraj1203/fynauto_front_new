import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["*"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
