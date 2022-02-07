const commonRestrictedSyntax = [
  {
    // Raise on `Vue.extend()`
    selector:
      'CallExpression > MemberExpression[object.name="Vue"][property.name="extend"]',
    message: "Use 'defineComponent' instead of 'Vue.extend'.",
  },
  {
    // Raise when calling watch() inside a watch() callback
    selector:
      'CallExpression[callee.name="watch"] CallExpression[callee.name="watch"]',
    message: 'Do not use nested watchers.',
  },
  {
    // Raise on `export { xyz as default }`
    selector:
      'ExportNamedDeclaration > ExportSpecifier[exported.name="default"]',
    message:
      'TypeScript auto-completion is not available for `export { abc as default }` syntax. Use `export default abc` instead.',
  },
];

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/recommended',
    'prettier/vue',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended', // any change which is enforced by Prettier, will be raised as a lint error
    'plugin:cypress/recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    // "project": "tsconfig.json"
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public'],
  rules: {
    // //////////////////////////////
    // GENERAL
    // //////////////////////////////
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // Avoid issues of importing packages not in the local dependency list,
    'import/no-extraneous-dependencies': ['error'],
    'import/no-unresolved': 'off',
    'no-duplicate-imports': 'error',
    // Being conscious about the bundle size, restrict top level imports that bloat the bundle.
    'no-restricted-imports': [
      'error',
      {
        paths: [
          // Lodash functions should be imported one-by-one,
          // such as import orderBy from 'lodash/orderBy';
          'lodash',
          // Vuetify should be imported as follows: import Vuetify from 'vuetify/lib';
          'vuetify',
        ],
      },
    ],
    // Define forbidden syntax by AST selector
    'no-restricted-syntax': ['error', ...commonRestrictedSyntax],

    // //////////////////////////////
    // TYPESCRIPT
    // //////////////////////////////

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_(1|2|3|4)?$',
        argsIgnorePattern: '^_(1|2|3|4)?$',
        // varsIgnorePattern and argsIgnorePAttern makes ESLint ignore _, _1, _2,... variables, useful when dealing with a lot of positional arguments.
        ignoreRestSiblings: true,
        // ignoreRestSiblings is useful when destructuring with rest is used. E.g. I want a copy of the object without the name property:
        // const {name, ...restWithoutName} = myObj;
        // if name is not used but restWithoutName is used, this won't be an error.
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['warn'],
    // Enforce all names to be either camelCase, PascalCase or UPPER_CASE
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default', // Match everything
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        // Ignore Apollo's typename props
        filter: {
          regex: '_(_typename)?',
          match: false,
        },
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // //////////////////////////////
    // VUE
    // //////////////////////////////

    // Ensure each component has name - helps with searchability
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['vue', 'jsx'],
        shouldMatchCase: true,
      },
    ],
    // Each component name have a name - helps with searchability
    'vue/require-name-property': ['error'],
    // Require `inheritAttrs: false`, if using $attrs in vue file
    'vue/no-duplicate-attr-inheritance': ['error'],
    // Avoid component conflicts with built-in Vue or native-HTML tags
    'vue/no-reserved-component-names': [
      'error',
      {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      },
    ],
    'vue/no-unused-properties': [
      'error',
      {
        groups: [
          /**
           * NOTE(2020-11-11, Juro Oravec): Props are disabled because the rule
           * detects false positives when some props are used ONLY inside setup
           * AND they are accessed via props obj like so:
           * ```
           * setup(props) {
           *   const { myProp } = toRefs(props);
           *   ...
           * }
           * ```
           *
           * To make the props work with setup, the props have to be destructured
           * in function's declaratioon, like so:
           * ```
           * setup({ myProp }) {
           *   ...
           * }
           * ```
           * but DO NOT use this approach because the props will lose reactivity
           * (see https://composition-api.vuejs.org/api.html#setup).
           */
          // 'props',
          'data',
          'computed',
          'methods',
          'setup',
        ],
      },
    ],
    'vue/no-useless-mustaches': [
      'error',
      {
        ignoreIncludesComment: true,
        ignoreStringEscape: true,
      },
    ],
    'vue/no-useless-v-bind': [
      'error',
      {
        ignoreIncludesComment: true,
        ignoreStringEscape: true,
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/**/*.{spec,test}.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
