import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

// 만약 VS Code 등에서 자동완성 기능을 사용하고 싶다면,
// 터미널에 npm i -D eslint-define-config 를 실행한 후
// 상단에 import { defineConfig } from 'eslint-define-config'; 를 추가하고
// export default defineConfig([...]); 와 같이 배열을 감싸주면 됩니다.
export default [
  // 1. 전역 설정
  {
    ignores: ['dist/'], // 'dist' 폴더는 검사하지 않음
  },

  // 2. 모든 JS/JSX 파일에 대한 기본 설정
  pluginJs.configs.recommended,

  // 3. React 관련 상세 설정
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser, // 브라우저 전역 변수 인식
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      // 각 플러그인의 추천 규칙 활성화
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',

      // 기존에 사용하시던 규칙
      'no-param-reassign': ['error', { props: false }],

      // 사용하지 않는 변수 처리 규칙 (중요!)
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // 밑줄(_)로 시작하는 인자는 무시
        },
      ],

      // React 프로젝트를 위한 추천 규칙
      'react/react-in-jsx-scope': 'off', // 최신 React에서는 'import React' 불필요
      'react/prop-types': 'off', // prop-types 사용 안 함
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    },
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전 자동 감지
      },
    },
  },

  // 4. Prettier 설정 (반드시 배열의 마지막에 위치해야 함)
  prettierConfig,
];