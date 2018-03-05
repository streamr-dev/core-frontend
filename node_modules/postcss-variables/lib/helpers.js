module.exports = {
	/**
	 * Delay the calculation of a variable until later
	 *
	 * @param {Function} fn
	 * @param {Array} args
	 * @returns {{type: string, fn: *, args: *}}
	 */
	defer(fn, args) {
		return {
			type: 'deferredFunction',
			fn: fn,
			args: args
		};
	},

	/**
	 * Auto-escape icon to prep for browser
	 *
	 * @param {string} icon
	 * @returns {string}
	 */
	icon(icon) {
		return `'\\${icon}'`;
	}
};