module.exports = {
  env: {
    node: true,
    jest: true,
    es2020: true
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
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
    'consistent-return': 2,
    'import/no-mutable-exports': 1,
    'no-undef': 1,
    'import/order': 0,
    'import/no-cycle': 0,
    'dot-notation': 0
  },
  overrides: [
    {
      files: ['src/controllers/*.ts', 'db/migrations/*.ts'], // overriding rule because I didn't use "this" in controller
      excludedFiles: [],
      rules: {
        'class-methods-use-this': 0
      }
    }
  ]
};
