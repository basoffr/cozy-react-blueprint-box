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
    // Custom rules to prevent hardcoded API URLs and direct fetch calls to API endpoints
    'no-restricted-syntax': [
      'error',
      { 
        selector: "Literal[value=/https:\\/\\/api\\.mydomain\\.com/]", 
        message: 'Use apiRequest() instead of hardcoded API URLs' 
      },
      {
        selector: "CallExpression[callee.name='fetch'][arguments.0.value=/^\\/api|\\/senders|\\/templates/]",
        message: 'Use apiRequest() from src/api/api.ts instead of direct fetch() calls to API endpoints'
      },
      {
        selector: "CallExpression[callee.name='fetch'][arguments.0.type='TemplateLiteral'][arguments.0.quasis.0.value.raw=/^\\/api|\\/senders|\\/templates/]",
        message: 'Use apiRequest() from src/api/api.ts instead of direct fetch() calls to API endpoints'
      }
    ],
  },
}
