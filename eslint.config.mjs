import security from 'eslint-plugin-security';

export default [
  // Ignore build output and dependencies
  {
    ignores: ['node_modules/**', 'reports/**', 'repos/**', 'db/**']
  },

  // Server-side / Node code (ESM)
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: { security },
    rules: {
      ...security.configs.recommended.rules,
      // Explicit high-value security rules for this project
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-object-injection': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-child-process': 'error'
    }
  },

  // Browser-side code
  {
    files: ['webapp/public/**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly'
      }
    }
  }
];
