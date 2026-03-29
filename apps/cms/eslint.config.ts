import nextConfig from '@repo/eslint-config/next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...nextConfig,
  {
    ignores: ['**/importMap.js', 'next-env.d.ts', 'src/migrations/**'],
  },
);
