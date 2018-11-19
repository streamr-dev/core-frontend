module.exports = {
  root: true,
  // parser: 'babel-eslint',
  env: {
    browser: true
  },

  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    'standard'
  ],

  plugins: [
    'html'
  ],

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 0
  },

  globals: {
  }
}
