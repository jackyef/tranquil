const prettierConfig = require('./.prettierrc.js')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    // React
    'plugin:react/recommended',

    // Typescript
    'plugin:@typescript-eslint/eslint-recommended',

    // Prettier
    'plugin:prettier/recommended',
  ],
  plugins: ['react-hooks', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ordered-imports': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // prettier rules
    'prettier/prettier': ['error', prettierConfig]
  },
};
