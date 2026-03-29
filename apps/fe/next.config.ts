import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [380, 420, 480, 648, 768, 1024],
    remotePatterns: [
      // LOCAL CMS
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/media/**',
      },
      // LOCAL FE
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      // PLACEHOLDER IMAGES
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // AZURE BLOB STORAGE (production media)
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
      // AZURE CONTAINER APPS (CMS)
      {
        protocol: 'https',
        hostname: '*.azurecontainerapps.io',
      },
      // If you need to load image from other domains, add them here...
    ],
  },
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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
