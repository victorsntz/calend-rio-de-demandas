import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Esconde o selo de desenvolvimento do Next no canto da tela.
  devIndicators: false,
};

export default nextConfig;
