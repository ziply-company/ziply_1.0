const { FlatCompat } = require('@eslint/eslintrc');
const { dirname } = require('path');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['.next/', 'dist/', 'build/', 'node_modules/', '*.mjs', '*.cjs', 'eslint.config.js'],
  },
  ...compat.config({
    extends: [
      // 'eslint:recommended' is now provided via js.configs.recommended to FlatCompat
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'next/core-web-vitals',
      'prettier',
      'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'prettier/prettier': ['error'],
    },
  }),
];
