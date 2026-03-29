import pluginNext from '@next/eslint-plugin-next';
import type { Linter } from 'eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import baseConfig from './base';

export default tseslint.config(
  baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules as Record<string, Linter.RuleEntry>,
      ...pluginNext.configs['core-web-vitals'].rules as Record<string, Linter.RuleEntry>,
      // Disable pages router rules since we use App Router
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      // We will use TypeScript types for component props instead.
      'react/prop-types': 'off',
    },
  },
);
