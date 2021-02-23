module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '.prettierrc.js'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    fetch: false,
  },
  rules: {
    'import/no-anonymous-default-export': [0],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // No need to import React when using Next.js
    'react/react-in-jsx-scope': 'off',
    // This rule is not compatible with Next.js's <Link /> components
    'jsx-a11y/anchor-is-valid': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
}
