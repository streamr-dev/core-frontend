# PostCSS Wee Syntax

[![Build Status](https://travis-ci.org/weepower/postcss-wee-syntax.svg?branch=master)](https://travis-ci.org/weepower/postcss-wee-syntax)
[![codecov](https://codecov.io/gh/weepower/postcss-wee-syntax/branch/master/graph/badge.svg)](https://codecov.io/gh/weepower/postcss-wee-syntax)
[![npm version](https://badge.fury.io/js/postcss-wee-syntax.svg)](https://badge.fury.io/js/postcss-wee-syntax)

<img width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS] syntax plugin used in the minimal front-end framework

[PostCSS]: (https://github.com/postcss/postcss)

```css
.block {
    mixin(#000, bold, url('/path/to/image.png'));
    otherMixin(family: ['Open Sans', Arial, sans-serif], weight: 700);
}
```

## Usage

```js
const syntax = require('postcss-wee-syntax');

postcss(plugins).process(css, {
	syntax: syntax
});
```

## Syntax Highlighting

Right now, you can set Sass syntax highlighting for .pcss files.

## Recommended Syntax Plugins

- [postcss-js-mixins](https://github.com/nathanhood/postcss-js-mixins)
- [postcss-variables](https://github.com/nathanhood/postcss-variables)
- [postcss-variable-media](https://github.com/nathanhood/postcss-variable-media)
- [postcss-nested-selectors](https://github.com/nathanhood/postcss-nested-selectors)