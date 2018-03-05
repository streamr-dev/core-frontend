const expect = require('chai').expect;
const postcss = require('postcss');
const plugin = require('./');
const register = require('./lib/register');
const { defer, icon } = require('./lib/helpers');

function process(input, expected, opts = {}) {
	return postcss([ plugin(opts) ]).process(input)
		.then((result) => {
			expect(result.css).to.equal(expected);
			expect(result.warnings().length).to.equal(0);
		});
}

function processFail(input, expected, opts = {}) {
	return postcss([ plugin(opts) ]).process(input)
		.then((result) => {
			expect(result.css).to.equal(expected);
			expect(result.warnings().length).to.equal(1);
		});
}

function processMixins(input, expected, opts = {}, errors = 0) {
	return postcss([ plugin(opts) ]).process(input, {
			syntax: require('postcss-wee-syntax')
		})
		.then((result) => {
			expect(result.css).to.equal(expected);
			expect(result.warnings().length).to.equal(errors);
		});
}

describe('Declarations', () => {
	it('should resolve values', () => {
		return process(
			`$size: 10px;
			a {
				width: $size;
				height: $size;
			}`,
			`a {
				width: 10px;
				height: 10px;
			}`
		);
	});

	it('should resolve nested values', () => {
		return process(
			`$size: 10px;
			.block {
				&__elem {
					width: $size;
				}
				height: $size;
			}`,
			`.block {
				&__elem {
					width: 10px;
				}
				height: 10px;
			}`
		);
	});

	it('should resolve multiple variables in the same declaration', () => {
		return process(
			`$fontStyle: italic;
			$fontSize: 2rem;
			$fontWeight: bold;
			a {
				font: $fontStyle $fontSize $fontWeight;
			}`,
			`a {
				font: italic 2rem bold;
			}`
		);
	});

	it('should resolve variable properties', () => {
		return process(
			`$decl: color;
			.block {
				$(decl): blue;
			}`,
			`.block {
				color: blue;
			}`
		);
	});

	it('should resolve variables as part of string values', () => {
		return process(
			`$path: /img/icons;
			.block {
				background-image: url('$(path)/share.svg');
			}`,
			`.block {
				background-image: url('/img/icons/share.svg');
			}`
		);
	});

	it('should resolve variables with variables as values', () => {
		return process(
			`$baseDir: /img;
			$path: $(baseDir)/share.png;
			body {
				background-image: url('$(path)');
			}`,
			`body {
				background-image: url('/img/share.png');
			}`
		);
	});
});

describe('Variable scope', () => {
	it('should be by block', () => {
		return process(
			`$size: 10px;
			.block {
				&__elem {
					$size: 20px;
					width: $size;
				}
				height: $size;
			}`,
			`.block {
				&__elem {
					width: 20px;
				}
				height: 10px;
			}`
		);
	});

	it('should not be visible to an outside block', () => {
		return processFail(
			`.block {
				&__elem {
					$size: 20px;
					width: $size;
				}
				height: $size;
			}`,
			`.block {
				&__elem {
					width: 20px;
				}
				height: $size;
			}`
		);
	});

	it('should resolve globals passed as plugin options', () => {
		return process(
			`a {
				color: $color;
				font-size: $fontSize;
			}`,
			`a {
				color: blue;
				font-size: 20px;
			}`,
			{
				globals: {
					color: 'blue',
					fontSize: '20px'
				}
			}
		);
	});

	it('should resolve nested global properties with dot notation', () => {
		return process(
			`.block {
				color: $colors.primary;
				&__elem {
					$colors: blue;
					width: $components.elem.width;
					&.-modifier {
						background-image: url('/img/icon.png');
						color: $colors;
						width: $components.elem.modified.width;
					}
				}
			}
			.block2 {
				color: $colors.primary;
			}`,
			`.block {
				color: #fff;
				&__elem {
					width: 10px;
					&.-modifier {
						background-image: url('/img/icon.png');
						color: blue;
						width: 20px;
					}
				}
			}
			.block2 {
				color: #fff;
			}`,
			{
				globals: {
					colors: {
						primary: '#fff'
					},
					components: {
						elem: {
							width: '10px',
							modified: {
								width: '20px'
							}
						}
					}
				}
			}
		);
	});
});

describe('Variable lists', () => {
	it('should be resolved with comma and space separating arguments', () => {
		return process(
			`$fontStyle: italic;
			$fontSize: 2rem;
			$fontFamily: "Open Sans", Arial, sans-serif;
			a {
				font: $fontStyle $fontSize $fontFamily;
			}`,
				`a {
				font: italic 2rem "Open Sans", Arial, sans-serif;
			}`
		);
	});
});

describe('Rules', () => {
	it('should resolve variable selectors', () => {
		return process(
			`$sel: .block;
			$(sel) {
				color: blue;
			}`,
			`.block {
				color: blue;
			}`
		);
	});

	it('should resolve nested variable selectors', () => {
		return process(
			`$sel: elem;
			.block {
				&__$(sel) {
					color: blue;
				}
			}`,
			`.block {
				&__elem {
					color: blue;
				}
			}`
		);
	});
});

describe('At-Rules', () => {
	it('should resolve params', () => {
		return process(
			`$condition: min-width;
			$size: 743px;
			@media ($condition: $size) {
				font-size: 20rem;
			}`,
			`@media (min-width: 743px) {
				font-size: 20rem;
			}`
		);
	});

	// TODO: Investigate why quotes are stripped from @import url('/$path/screen.css')
	// TODO: Not this plugin (see test below). Looks to be postcss itself.
	it('should resolve @import path', () => {
		return process(
			`$path: ./path/to;
			@import '$(path)/style.css'`,
			`@import './path/to/style.css'`
		);
	});

	// TODO: Finish @rule tests (font-face, supports, etc)
});

describe('Mixins', () => {
	it('should resolve params passed into mixins (postcss-js-mixins)', () => {
		return processMixins(
			`$color: #000;
			.block {
				mixin($color);
				mixin($colors.primary);
			}`,
			`.block {
				mixin(#000);
				mixin(#fff);
			}`,
			{
				globals: {
					colors: {
						primary: '#fff'
					}
				}
			}
		);
	});

	it('should resolve mixture of params passed into mixin', () => {
		return processMixins(
			`$color: #000;
			.block {
				mixin($color, url('string.png'), 10, 30px, $colors.primary);
			}`,
			`.block {
				mixin(#000, url('string.png'), 10, 30px, #fff);
			}`,
			{
				globals: {
					colors: {
						primary: '#fff'
					}
				}
			}
		);
	});

	it('should resolve key: value params passed into mixin', () => {
		return processMixins(
			`$color: #000;
			.block {
				mixin(color: $color, 10, 30px);
			}`,
			`.block {
				mixin(10, 30px, color: #000);
			}`
		);
	});
});

describe('Registering and deferring variables', () => {
	it('should return function', () => {
		expect(typeof register()).to.equal('function');
	});

	it('should return evaluated object when executed', () => {
		let vars = {
				prop1: 'test',
				prop2: '$prop1'
			},
			results = register(vars)();

		expect(JSON.stringify(results)).to.equal('{"prop1":"test","prop2":"test"}');
	});

	it('should evaluate dot notated variable references', () => {
		let vars = {
				colors: {
					primary: '#000'
				},
				input: {
					color: '$colors.primary'
				}
			},
			results = register(vars)();

		expect(results.input.color).to.equal('#000');
	});

	it('should be able to override properties that are referenced by other properties', () => {
		let vars = {
				colors: {
					primary: '#000'
				},
				input: {
					color: '$colors.primary'
				}
			};

		// Override variable
		vars.colors.primary = '#eee';

		let results = register(vars)();

		expect(results.input.color).to.equal('#eee');
		expect(results.colors.primary).to.equal('#eee');
	});

	it('should be able to defer property function execution', () => {
		let colorFn = (val) => {
				return val;
			},
			vars = {
				colors: {
					primary: '#fff'
				},
				input: {
					color: defer(colorFn, ['$colors.primary'])
				}
			};

		// Make overriding change that affects function outcome
		vars.colors.primary = '#000';

		let results = register(vars)();

		expect(results.input.color).to.equal('#000');
	});
});

describe('Helpers: icon', () => {
	it('should escape and wrap icon in quotes', () => {
		expect(icon('e803')).to.equal("'\\e803'");
		expect(icon("e803")).to.equal("'\\e803'");
	});
});