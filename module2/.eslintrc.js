module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-unused-expressions': 'off',
    'no-console': 'off',
    'vue/attribute-hyphenation': 'off',
    'no-debugger': 'off',
    'no-extra-boolean-cast': 'off',
  },
};
