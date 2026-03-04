import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side-effect imports first (e.g. polyfills, css)
            ['^\\u0000'],
            // Node.js built-ins
            ['^node:'],
            // React / Next.js
            ['^react$', '^react/', '^next$', '^next/'],
            // Third-party packages
            ['^@?\\w'],
            // Internal aliases (@/)
            ['^@/'],
            // Relative imports (parent, sibling, index)
            ['^\\.\\./'],
            ['^\\./', '^\\./(?=.*/)(?!.*\\.s?css$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports last
            ['\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-duplicate-imports': 'error',
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },
])
