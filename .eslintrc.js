// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // Settings for TypeScript linting
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint:recommended',
    'standard',
    'plugin:prettier/recommended',
  ],
  // required to lint *.ts files
  plugins: ['@typescript-eslint'],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-await': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    '@typescript-eslint/member-delimiter-style': 'off',
    'no-new': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
}
