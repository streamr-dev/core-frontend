'use strict';

const Parser = require('./Parser');
const Input = require('postcss/lib/input');

module.exports = (root, opts) => {
	let input = new Input(root, opts);
	let parser = new Parser(input);

	parser.parse();

	return parser.root;
};