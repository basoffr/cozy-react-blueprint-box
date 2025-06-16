module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    // Prevent controlled to uncontrolled input warnings
    'react/jsx-no-leaked-render': [
      'error',
      { validStrategies: ['ternary', 'coerce'] }
    ],
    // Prevent direct optional chaining in JSX props that could lead to undefined values
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // Since we're using TypeScript
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
