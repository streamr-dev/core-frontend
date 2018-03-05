'use strict';

const postcss = require('postcss');
const helpers = require('./lib/helpers');

module.exports = postcss.plugin('postcss-js-mixins', (options = {}) => {
	let mixins = options.mixins || {},
		mixinArguments = {};

	if (options.units) {
		helpers.setDefaultUnits(options.units);
	}

	function isNumber(value) {
		let val = parseFloat(value);

		// Check that parseFloat did not create NaN or infinity and
		// make sure no other characters exist in original value but numerical digits
		return ! isNaN(val) && isFinite(val) && ! /[^\d.]/.test(value);
	}

	/**
	 * Convert argument to proper type
	 *
	 * @param {string} arg
	 * @returns {*}
	 */
	function castArgument(arg) {
		if (isNumber(arg)) {
			return parseFloat(arg);
		}

		if (helpers.isFraction(arg)) {
			arg = arg.split('/');

			return arg[0] / arg[1];
		}

		if (arg === 'false' || arg === 'true') {
			return arg === 'true';
		}

		return arg.length ? arg : undefined;
	}

	/**
	 * Generate arguments array
	 *
	 * @param {string} name
	 * @param {function} mixin
	 * @param {object} obj - mixin arguments property
	 * @returns {Array}
	 */
	function getArguments(name, mixin, obj) {
		let named = obj.named,
			ordered = obj.ordered,
			args = [],
			parameters;

		// Cache function parameter names
		if (! mixinArguments[name]) {
			mixinArguments[name] = mixin.toString()
				// Strip out quoted strings (stripping possible commas from parameters)
				.replace(/'((?:[^'\\])*)'|"((?:[^"\\])*)"/g, '')
				// Pull out parameters from function
				.match(/(?:function)?\s?.*?\s?\(([^)]*)\)/)[1]
				.split(',')
				.map(function(arg) {
					return arg.split('=')[0].trim();
				});
		}

		parameters = mixinArguments[name];

		Object.keys(named).forEach(key => {
			parameters.forEach((param, i) => {
				if (key === param) {
					args[i] = castArgument(named[key]);
				}
			});
		});

		ordered.forEach((arg, i) => {
			args[i] = castArgument(arg);
		});

		return args;
	}

	/**
	 * Evaluate mixin
	 *
	 * @param {object} node - postcss.Node
	 * @param {object} result - postcss.Result
	 * @returns {array|object}
	 */
	function evalMixin(node, result) {
		let key = node.name,
			mixin = mixins[key];

		if (! mixin) {
			node.warn(result, 'Mixin not found.');
			return [];
		}

		return mixin.apply(mixins, getArguments(key, mixin, node.arguments));
	}

	/**
	 * Create many declarations/rules from one mixin result
	 *
	 * @param {array} data
	 * @param {object} node - postcss.Mixin
	 */
	function createNodes(data, node) {
		return data.map(obj => {
			return createNode(obj, node);
		});
	}

	function createNode(obj, node) {
		if (obj.type === 'rule') {
			return createRule(obj.selector, obj.declarations, node);
		}

		return createDeclaration(obj.prop, obj.value, node);
	}

	/**
	 * Create postcss declaration with meta info from mixin
	 *
	 * @param {string} selector
	 * @param {Array} declarations - one or many postcss.Declaration
	 * @param {object} node - postcss.Mixin
	 * @returns {Rule}
	 */
	function createRule(selector, declarations, node) {
		let rule = postcss.rule({
			selector: selector,
			source: node.source
		});

		declarations.forEach(decl => {
			rule.append(createDeclaration(decl.prop, decl.value, node));
		});

		return rule;
	}

	/**
	 * Create postcss declaration with meta info from mixin
	 *
	 * @param {string} prop
	 * @param {string|number} value
	 * @param {object} node - postcss.Mixin
	 * @returns {Declaration}
	 */
	function createDeclaration(prop, value, node) {
		let decl = postcss.decl({
			prop: prop,
			value: value,
			source: node.source
		});

		return decl;
	}

	return (root, result) => {
		root.walk(node => {
			if (node.type === 'mixin') {
				let results = evalMixin(node, result);

				// Remove mixin from CSS
				// Accounting for conditional mixin logic
				if (results === false) {
					return node.remove();
				}

				if (Array.isArray(results)) {
					if (! results.length) {
						return;
					}

					node.replaceWith(createNodes(results, node));
				} else {
					node.replaceWith(createNode(results, node));
				}
			}
		});
	};
});