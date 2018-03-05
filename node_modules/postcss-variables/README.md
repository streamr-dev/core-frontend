# PostCSS Variables

[![Build Status](https://travis-ci.org/nathanhood/postcss-variables.svg?branch=master)](https://travis-ci.org/nathanhood/postcss-variables)
[![codecov](https://codecov.io/gh/nathanhood/postcss-variables/branch/master/graph/badge.svg)](https://codecov.io/gh/nathanhood/postcss-variables)
[![npm version](https://badge.fury.io/js/postcss-variables.svg)](https://badge.fury.io/js/postcss-variables)

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

Converts variables into CSS.

```scss
/* before (nesting requires postcss-nested) */

$dir: assets/icons;
$color: blue;

.block {
	background: url('$(dir)/foo.png');
	&__elem {
		$color: green;
		color: $color;
	}
	&__elem2 {
		color: $color;
	}
}

/* after */

.block {
	background: url('assets/icons/foo.png');
	&__elem {
		color: green;
	}
	&__elem2 {
		color: blue;
	}
}
```


## Usage

Add PostCSS Variables to your build tool:

```bash
npm install postcss-variables --save-dev
```

#### Node

```js
require('postcss-variables')({ /* options */ }).process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS](https://github.com/postcss/postcss) to your build tool:

```bash
npm install postcss --save-dev
```

Load PostCSS Variables as a PostCSS plugin:

```js
postcss([
	require('postcss-variables')({ /* options */ })
]);
```

## Options

### `globals`

Type: `Object`  
Default: `{}`

Specifies your own global variables.

```js
require('postcss-variables')({
	globals: {
		siteWidth: '960px',
		colors: {
			primary: '#fff',
			secondary: '#000'
		}
	}
});
```

```css
/* before */

.hero {
	color: $colors.primary;
	max-width: $siteWidth;
}

/* after */

.hero {
	color: #fff;
	max-width: 960px;
}
```

## Advanced
 
When creating your global variables, you may want to eliminate duplication by referencing an existing property to define your new variable. You can do this by referencing variables like you would in your stylesheet. Here is the basic idea:

```js
let vars = {
	colors: {
		primary: '#fff'
	},
	heading: {
		color: '$colors.primary'
	}
 };
```

In certain circumstances, you may want to create a base variables file that you would want to be able to override. This would be a use-case if you were using this plugin inside of some kind of framework.
If you are using functions to calculate global variables, you may want to delay the function execution until after you had a chance to override your variables. This can be done by using the `defer` method.

```js
function darken(color, pct) {
	// Do something to calculate darker hex value
	return result
}

module.exports = {
	colors: {
		white: '#fff',
		gray: defer(darken, ['$colors.white', 35])
	}
 };
```

This is what a full example would look like in order to use these features:

```js
/* variables.js */
const { defer } = require('postcss-variables/lib/helpers');
const register = require('postcss-variables/lib/register');

function darken(color, pct) {
	// Do something to calculate darker hex value
	return result
}

let vars = {
	colors: {
		primary: '#fff',
		gray: defer(darken, ['$colors.white', 35])
	},
	heading: {
		color: '$colors.primary'
	}
};

module.exports = register(vars);
```