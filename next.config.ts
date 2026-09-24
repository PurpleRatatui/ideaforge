import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^cloudflare:workers$/,
        path.resolve(process.cwd(), "lib/vercel/cloudflare-workers-shim.ts"),
      ),
    );
    return config;
  },
};

export default nextConfig;
