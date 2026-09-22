import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.vercel/**',
      '**/coverage/**',
      // Leftover Next.js tree at the repo root — not part of the build.
      'src/**',
      'apps/web/content/**',
      'scripts/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-multi-assign': 'error',
      'no-new-func': 'error',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-useless-assignment': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      radix: 'error',
      'symbol-description': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'resend',
              message: 'Import Resend only in src/lib/email.ts. Use env() / sendOrLog().',
            },
          ],
        },
      ],
      // TS already flags undefined names; the base rule false-positives on types.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^Props$',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Existing files still use `any` for Sanity image blobs. Ban growth via
      // conventions.mjs (ratchet); don't fail the whole tree here.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: [
      '**/pages/api/**',
      '**/lib/email.ts',
      '**/layouts/BaseLayout.astro',
      '**/layouts/BaseLayout.astro/**',
      '**/components/posthog.astro',
      '**/components/posthog.astro/**',
    ],
    rules: {
      'no-console': 'off',
      'no-var': 'off',
      'prefer-const': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-rest-params': 'off',
      'object-shorthand': 'off',
      eqeqeq: 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-empty': 'off',
      'no-sequences': 'off',
      'no-multi-assign': 'off',
    },
  },
  {
    files: ['**/lib/email.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['apps/web/src/emails/**'],
    rules: {
      // React Email templates are allowed to look like email HTML.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.mjs', '**/scripts/**'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      'no-console': 'off',
    },
  },
);
