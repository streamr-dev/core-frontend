'use strict';

const Stringifier = require('./Stringifier');

module.exports = (node, builder) => {
	const str = new Stringifier(builder);

	str.stringify(node);
};