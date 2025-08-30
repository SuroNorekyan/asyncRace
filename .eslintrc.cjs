/* eslint-disable import/no-commonjs */
const path = require('node:path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [path.join(__dirname, 'tsconfig.eslint.json')],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: path.join(__dirname, 'tsconfig.eslint.json'),
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // RTK uses Immer – allow mutation in reducers
    'no-param-reassign': ['error', { props: false }],

    // Project requirements
    'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
    complexity: ['warn', 12],

    // Your codebase prefers arrow components
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],

    // TS + Vite don’t need explicit extensions
    'import/extensions': 'off',

    // Keep devDeps allowed in config & tooling files
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/vite.config.ts',
          '**/*.config.*',
          '**/scripts/**',
          '**/*.test.*',
          '**/*.spec.*',
        ],
      },
    ],

    // Calm noisy rules that don’t add value here
    'import/no-cycle': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    // UI components can be longer without harming readability
    {
      files: ['src/components/**/*.tsx'],
      rules: {
        'max-lines-per-function': ['error', { max: 120, skipBlankLines: true, skipComments: true }],
        complexity: ['warn', 20],
      },
    },
    // runner is a tight async orchestration unit – give it a little headroom
    {
      files: ['src/features/race/runner.ts'],
      rules: {
        'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      },
    },
    // winners/thunks sometimes uses a loop + awaits to sequence requests – allow it
    {
      files: ['src/features/winners/thunks.ts'],
      rules: {
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['vite.config.ts'],
      rules: { 'import/no-default-export': 'off' },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    // build tsconfigs
    'tsconfig.*.json',
  ],
};
