import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
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
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Import ordering
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

      // Enforce `import type` for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Code quality
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
])
