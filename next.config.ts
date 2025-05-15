import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://rather-side-wedding-kerry.trycloudflare.com",
  ],
  /* config options here */
};

export default nextConfig;
