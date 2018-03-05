'use strict';

const Node = require('postcss/lib/node');

class Mixin extends Node {
	constructor(defaults) {
		let _this = super(defaults);

		_this.type = 'mixin';

		return _this;
	}
}

module.exports = Mixin;