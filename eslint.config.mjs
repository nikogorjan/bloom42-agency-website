// eslint.config.mjs
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  // Next.js + TypeScript base rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Project rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // General TS tweaks
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',

      // Disable default unused-vars checks (use plugin instead)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // 🔧 Remove unused imports on --fix
      'unused-imports/no-unused-imports': 'error',

      // Warn on unused vars/args; prefix with "_" to ignore
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },

  // Ignores
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      // remove this line if you actually keep JS in public
      'public/**',
    ],
  },
]
