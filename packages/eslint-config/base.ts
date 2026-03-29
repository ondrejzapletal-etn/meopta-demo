import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * A shared ESLint configuration for the repository.
 * */
export default tseslint.config(
  eslint.configs.recommended,

  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  stylistic.configs.recommended,
  {
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
  },

  {
    ignores: ['**/node_modules', '**/.next', '**/dist', '**/build'],
  },
);
