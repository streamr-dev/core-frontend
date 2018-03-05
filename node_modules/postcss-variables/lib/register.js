module.exports = (variables = {}) => {
	let vars;

	/**
	 * Retrieve property value from vars object
	 *
	 * @param {string} keys
	 * @returns {*}
	 */
	function getProp(keys) {
		let segs = keys.toString().split('.'),
			key = segs.shift().replace(/^\$/, ''),
			value = null;

		// Confirm that string is variable reference
		if (! /^\$/.test(keys)) {
			return keys;
		}

		if (vars[key]) {
			value = vars[key];

			while (segs.length && value.hasOwnProperty(segs[0])) {
				value = value[segs[0]];
				segs.shift();
			}
		}

		return value;
	}

	/**
	 * Execute deferred function to calculate variable value
	 *
	 * @param {Function} fn
	 * @param {Array} args
	 * @returns {*}
	 */
	function evalFn(fn, args) {
		return fn.apply(null, args.map(arg => {
			let result = arg;

			if (typeof arg === 'string') {
				result = getProp(arg);
			}

			return result;
		}));
	}

	/**
	 * Traverse entire object structure recursively
	 *
	 * @param {Object|Array} obj
	 */
	function traverse(obj) {
		let props = Object.keys(obj),
			i;

		for (i = 0; i < props.length; i++) {
			let value = obj[props[i]],
				type = typeof value;

			if (type === 'object') {
				if (value.type === 'deferredFunction') {
					obj[props[i]] = evalFn(value.fn, value.args);
				} else {
					traverse(value);
				}
			} else if (type === 'string') {
				obj[props[i]] = getProp(value);
			}
		}
	}

	return () => {
		vars = Object.assign({}, variables);

		traverse(vars);

		return vars;
	};
};