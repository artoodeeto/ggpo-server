module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: ['airbnb-base', 'plugin:import/typescript', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules'],
  rules: {
    ignoreExport: 0,
    'import/prefer-default-export': 0,
    'no-console': 2,
    'comma-dangle': 0,
    'import/first': 0,
    'no-unused-vars': 1,
    'consistent-return': 2,
    'import/no-mutable-exports': 1,
    'no-undef': 1,
    'import/order': 0,
    'import/no-cycle': 0,
    'dot-notation': 0
  },
  overrides: [
    {
      files: ['src/controllers/*.ts'], // overiding the rule for this file because overnightjs doesnt use the methods in its class
      excludedFiles: [],
      rules: {
        'class-methods-use-this': 0
      }
    }
  ]
};
