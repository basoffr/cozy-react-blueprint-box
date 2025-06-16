module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Custom rule to prevent hardcoded API URLs
    'no-restricted-syntax': [
      'error',
      { 
        selector: "Literal[value=/https:\\/\\/api\\.mydomain\\.com/]", 
        message: 'Use apiRequest() instead of hardcoded API URLs' 
      },
    ],
  },
}
