import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /*
   * The dev-mode route indicator (bottom-left "N" badge) sits directly on
   * top of the hero's social icons on small screens. It never ships to
   * production, but it makes local mobile testing (e.g. over the LAN) look
   * broken, so it is switched off here.
   */
  devIndicators: false,
};

export default nextConfig;
