import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: { "/*": ["./.local/**/*"] },
};
export default nextConfig;
