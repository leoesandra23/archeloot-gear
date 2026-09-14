import type { NextConfig } from "next";

const frameAncestors = process.env.IPS_FRAME_ANCESTORS?.trim()
  || "'self' https://mmonexus.com.br https://www.mmonexus.com.br";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors ${frameAncestors};` },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
