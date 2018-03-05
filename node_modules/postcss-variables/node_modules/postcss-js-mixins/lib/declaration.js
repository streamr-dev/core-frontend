const h = require('./helpers');

function decl(prop, value) {
	return {
		type: 'declaration',
		prop: prop,
		value: h.unit(value, prop)
	};
}

/**
 * Build many declarations from object
 *
 * @param  {Object} properties
 * @param  {Array} ignored
 * @return {Array}
 */
decl.createManyFromObj = function (properties, prefix = false, ignored = []) {
	let props = [];

	for (let property in properties) {
		let value = properties[property];

		props.push(
			decl(h.prefix(property, prefix, ignored), value)
		);
	}

	return props;
}

/**
 * Builds an array of supplied properties and values.  This function
 * assumes that there are the same number of values as properties
 * and that the properties array is in the correct order relative it's
 * value
 *
 * @param {Array} props - array of properties
 * @param {Array|String} values - array of values
 * @param {string|boolean} prefix
 * @return {Array}
 */
decl.createMany = function (props, values, prefix = false) {
	let arr = [],
		i = 0;

	if (h.isString(values)) {
		for (; i < props.length; i++) {
			let prop = prefix ? `${prefix}-${props[i]}` : props[i];

			arr.push(decl(prop, values));
		}
	} else {
		for (; i < values.length; i++) {
			let prop = prefix ? `${prefix}-${props[i]}` : props[i];

			arr.push(decl(prop, values[i]));
		}
	}

	return arr;
}

module.exports = decl;