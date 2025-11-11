// eslint.config.mjs
import tseslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build artifacts and plain JS at the top level (adjust if needed)
  { ignores: ['dist', 'coverage', 'node_modules', '*.js'] },

  // Base TypeScript rules
  ...tseslint.configs.recommended,

  // Your project rules & parser options
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: new URL('.', import.meta.url).pathname, // same as __dirname
        project: ['./tsconfig.eslint.json'], // keep using your ESLint-only tsconfig
      },
    },
    plugins: { prettier: pluginPrettier },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error',
    },
  },

  // Turn off rules that conflict with Prettier
  prettier
);
