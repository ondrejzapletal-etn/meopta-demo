import nextConfig from '@repo/eslint-config/next';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { dirname, resolve } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  nextConfig,

  {
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      ...betterTailwindcss.configs['recommended-warn']?.rules,
      ...betterTailwindcss.configs['recommended-error']?.rules,
      'better-tailwindcss/no-unregistered-classes': ['error', {
        detectComponentClasses: true,
        entryPoint: resolve(__dirname, './src/app/globals.css'),
      }],
      // Prefers single line. When they get too long, they should be split into multiple lines in groups.
      'better-tailwindcss/enforce-consistent-line-wrapping': ['error', {
        group: 'newLine',
        preferSingleLine: true,
        lineBreakStyle: 'unix',
      }],

    },
    settings: {
      'better-tailwindcss': {
        entryPoint: resolve(__dirname, './src/app/globals.css'),
        // Lint object values in className/classNames attributes/props
        attributes: [
          [
            'classNames?',
            [
              {
                match: 'objectValues',
              },
            ],
          ],
        ],
        // Lint object values in className/classNames variables
        variables: [
          [
            'classNames?',
            [
              {
                match: 'objectValues',
              },
            ],
          ],
        ],
      },
    },
  },

  // Configuration for .mjs files
  {
    files: ['**/*.mjs'],
    rules: {
      // Disable TypeScript-specific rules for .mjs files
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    ignores: ['next-env.d.ts'],
  },
);
