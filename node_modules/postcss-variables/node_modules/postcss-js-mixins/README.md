# PostCSS JS Mixins

[![Build Status](https://travis-ci.org/nathanhood/postcss-js-mixins.svg?branch=master)](https://travis-ci.org/nathanhood/postcss-js-mixins)
[![codecov](https://codecov.io/gh/nathanhood/postcss-js-mixins/branch/master/graph/badge.svg)](https://codecov.io/gh/nathanhood/postcss-js-mixins)
[![npm](https://badge.fury.io/js/postcss-js-mixins.svg)](https://badge.fury.io/js/postcss-js-mixins)

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS] plugin for custom mixin syntax

[PostCSS]: (https://github.com/postcss/postcss)

```css
/* before */
.block {
	column(spaced, 1, 2);
}

/* after */
.block {
	float: left;
	width: 50%;
	margin-left: 5%;
}

/* before */
.block {
	spacedBlock(width: 10px);
}

/* after */
.block {
	margin-bottom: 2rem;
	width: 10px;
	display: block;
}
```

## Usage

```js
const syntax = require('postcss-wee-syntax');
const mixins = require('postcss-js-mixins');

postcss([ mixins({ /* options */ }) ]).process(input, {
			syntax: syntax
		})
		.then(result => {
			// Do something with result
		});
```

See [PostCSS] docs for examples for your environment.

## Options

### `mixins`

Type: `Object`  
Default: `{}`

Register mixins that you want to reference in your style sheets. 

```js
const decl = require('postcss-js-mixins/lib/declaration');
const { isEmpty } = require('postcss-js-mixins/lib/helpers');

require('postcss-js-mixins')({
	mixins: {
		/**
		* Example of creating a shorthand with default value
		*/
		spaced(value = '20px') {
			return decl('margin-bottom', value);
		}
	}
});
```

### `units`

Type: `Object`  
Default: `{ default: 'rem', lineHeight: 'em' }`

These units will be appended intelligently when number values are passed without a unit. For example, the `font-size` property will have the unit appended, but opacity will not.

## Writing Mixins

Mixins are written solely in JavaScript. They can return a declaration, a rule, or an array of declarations/rules. 

### Declaration

Declarations take a CSS property and it's value as arguments.


```js
const decl = require('postcss-js-mixins/lib/declaration');

// Create single declaration
decl(prop, value);
```

### Rule

Rules take a selector and an array of `Declaration` objects.

```js
const rule = require('postcss-js-mixins/lib/rule');

// Create single declaration
rule('.block:after', [
	decl(prop, value),
	decl(prop, value)
]);
```

#### Methods

#### `createMany`
Matches indexes from two arrays to produce declarations for each. This is used when order matters for your mixin arguments.

```js
// Create multiple declarations
function position(...args) {
	return decl.createMany(['top', 'right', 'left', 'bottom'], args);
}
```
```css
position(10%, 0, false, 0);
```

#### `createManyFromObj`
Takes an object with `property: value` pairs and an optional prefix to prepend to each property value.

```js
// Create multiple declarations from an object
function padding(top = 0, right = 0, bottom = 0, left = 0) {
	return decl.createManyFromObj({
		top: top,
		right: right,
		bottom: bottom,
		left: left
	}, 'padding');
}
```
```css
padding(top: '10px', left: '12px');

/* Output */
padding-top: 10px;
padding-right: 0;
padding-bottom: 0;
padding-left: 12px;
```

### `Helper Methods`
Helper methods have been provided in order to make writing mixins easier.

```js
const helpers = require('postcss-js-mixins/lib/helpers');
const { darken, lighten } = require('postcss-js-mixins/lib/colorHelpers');
```

#### List of Helper Methods

- darken
- lighten
- calcOpacity
- hexToRgba
- isColor
- isEmpty
- isNumber
- isObject
- isPercentage
- isProvided
- isString
- isUnit
- prefix
- setDefaultUnits
- toDashCase
- toDegrees
- type
- unit

**Note:** This plugin uses [TinyColor](https://github.com/bgrins/TinyColor) which has a large number of other color helper methods that can easily be exposed if requested.