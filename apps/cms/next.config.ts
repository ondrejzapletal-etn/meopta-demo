import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config) => {
    /**
     * Setting `exprContextCritical: false` disables webpack's critical dependency warnings
     * that occur when webpack cannot statically analyze dynamic imports or requires.
     *
     * It mutes warnings in instrumentation.ts for this code:
     * ```await import('./instrumentation.node')```
     */
    config.module.exprContextCritical = false;
    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
