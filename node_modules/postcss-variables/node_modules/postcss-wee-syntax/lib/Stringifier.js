'use strict';

const BaseStringifier = require('postcss/lib/stringifier');

class Stringifier extends BaseStringifier {
	mixin(node) {
		let string = node.name + '(' + Stringifier.transformArguments(node) + ');';

		this.builder(string, node);
	}

	/**
	 * Convert mixin arguments back to string (both key: value pairs and simple)
	 *
	 * @param {object} node
	 * @returns {string}
	 */
	static transformArguments(node) {
		let orderedArgs = node['arguments'].ordered,
			namedArgs = node['arguments'].named,
			objKeys = Object.keys(namedArgs),
			result;

		result = orderedArgs.map((arg, i) => {
				if (node.fontArgs[i.toString()]) {
					return '[' + arg + ']';
				}

				return arg;
			}).join(', ');

		objKeys.map((key, i) => {
			// Strip commas if argument is a font family argument
			let arg = node.fontArgs[key] ?
				'[' + namedArgs[key] + ']':
				namedArgs[key];

			if (i < result.length - 1) {
				result += ', ';
			}

			result += `${key}: ${arg}`;

			return result;
		});

		return result;
	}
}

module.exports = Stringifier;