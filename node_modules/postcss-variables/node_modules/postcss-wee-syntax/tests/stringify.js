const parse = require('../lib/parse');
const stringify = require('../lib/stringify');
const cases = require('postcss-parser-tests');
const expect = require('chai').expect;
const fs = require('fs');

function process(css) {
	let result = '';
	let root = parse(css);

	stringify(root, i => {
		result += i;
	});

	return result;
}

describe('stringify', () => {
	cases.each((name, css, json) => {
		if (name === 'bom.css') {
			console.log();
			return;
		}

		it('should stringify ' + name, () => {
			let result = '';
			let root = parse(css);

			stringify(root, i => {
				result += i;
			});

			expect(result).to.equal(css);
		});
	});

	it('should parse double quoted values', () => {
		let css = 'html { font-family: \'"1"\' }',
			root = parse(css),
			result = '';

		stringify(root, i => {
			result += i;
		});

		expect(result).to.equal(css);
	});
});

describe('stringify mixins', () => {
	it('should stringify mixins', () => {
		let css = 'a { custom(); }',
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse comma separated values as arguments', () => {
		let css = ".block { mixin(1, bold, url('test.png'), #000, rgb(0, 0, 0)); }",
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse key: value pair as argument', () => {
		let css = ".block { mixin(key: value); }",
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse many key: value pairs as arguments', () => {
		let css = ".block { mixin(padding: 1, weight: bold, background: url('test.png')); }",
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse combination of arguments, but out of order (ordered arguments before named arguments)', () => {
		let css = ".block { mixin(top, padding: 1, weight: bold, 20, background: url('test.png')); }",
			result = process(css);

		expect(result).to.equal(".block { mixin(top, 20, padding: 1, weight: bold, background: url('test.png')); }");
	});

	it('should parse font-family arguments', () => {
		let css = ".block { mixin(['Open Sans', Arial, sans-serif]); }",
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse font-family arguments among other arguments', () => {
		let css = ".block { mixin(bold, ['Open Sans', Arial, sans-serif], #000); }",
			result = process(css);

		expect(result).to.equal(css);
	});

	it('should parse font-family arguments as key: value', () => {
		let css = ".block { mixin(fontFamily: ['Open Sans', Arial, sans-serif], color: #000, family: ['Open Sans', Arial, sans-serif]); }",
			result = process(css);

		expect(result).to.equal(css);
	});
});

describe('stringify comments', () => {
	it('should stringify block comments', () => {
		let css = fs.readFileSync(__dirname + '/cases/block-comment.css', 'utf-8'),
			result = process(css);

		expect(result).to.equal(css);
	});
});