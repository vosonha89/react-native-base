import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

const nodeScriptFiles = {
  files: [
    '__scripts__/*.js',
    '.prettierrc.js',
    'babel.config.js',
    'jest.config.js',
    'metro.config.js',
    'react-native.config.js',
  ],
  languageOptions: { globals: globals.node },
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    'no-undef': 'off',
  },
};

export default [
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    settings: { react: { version: 'detect' } },
    rules: {
      semi: ['error', 'always'],
      'no-debugger': 'off',
      'no-useless-constructor': 'off',
      'no-var': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: true,
          allowedNames: ['me'],
        },
      ],
    },
  },
  nodeScriptFiles,
];
