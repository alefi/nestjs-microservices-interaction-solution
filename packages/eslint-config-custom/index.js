module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'turbo',
    'prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'contrib/**/*', 'dist/**/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', require('../../.prettierrc')],
  },
};
