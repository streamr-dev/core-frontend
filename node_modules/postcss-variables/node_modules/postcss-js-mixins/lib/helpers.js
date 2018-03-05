const tinycolor = require('tinycolor2');

let units = {
	default: 'rem',
	lineHeight: 'em'
};

function setDefaultUnits(overrides) {
	units = Object.assign(units, overrides);
}

/**
 * Calculate opacity
 *
 * @param  {string|int} opacity
 * @return {number}
 */
function calcOpacity(opacity) {
	if (isPercentage(opacity)) {
		opacity = opacity.replace('%', '') / 100;
	} else if (opacity > 1) {
		opacity = opacity / 100;
	}

	return opacity;
}

/**
 * Convert color values to RGBa
 *
 * @param  {string}  color
 * @param  {string|boolean} opacity
 * @return {string}
 */
function toRgba(color, opacity = false) {
	color = tinycolor(color);

	if (opacity) {
		color.setAlpha(calcOpacity(opacity));
	}

	return color.toRgbString();
}

/**
 * Determine if supplied argument is a color (hex, hsl(a) rgb(a))
 *
 * @param  {string}  value
 * @return {boolean}
 */
function isColor(value) {
	return tinycolor(value).isValid();
}

/**
 * Determine if value is empty
 *
 * @param  {*} value
 * @return {boolean}
 */
function isEmpty(value) {
	if (Array.isArray(value)) {
		// If first item in array is undefined, we assume there are no parameters
		// This happens as a result of using the rest operator in a mixin
		return value.length === 0 || value[0] === undefined;
	}

	return value === undefined;
}

/**
 * Determine if supplied argument is a fraction
 *
 * @param {*} value
 * @returns {boolean}
 */
function isFraction(value) {
	if (typeof value !== 'string') {
		return false;
	}

	value = value.split('/');

	return value.length === 2 && value[0] % 1 === 0 && value[1] % 1 === 0;
}

/**
 * Determine if supplied argument is a number
 *
 * @param  {*} value
 * @return {boolean}
 */
function isNumber(value) {
	value = parseFloat(value);

	return ! isNaN(value) && isFinite(value);
}

/**
 * Determine whether supplied arguments represent multiple variable declarations
 *
 * @param  {Array} obj
 * @return {boolean}
 */
function isObject(obj) {
	return type(obj) === 'object';
}

/**
 * Determine if supplied argument is a percentage
 *
 * @param  {value}  value
 * @return {boolean}
 */
function isPercentage(value) {
	return /^\d+%$/g.test(value);
}

/**
 * Determine if argument has been provided
 *
 * @param value
 * @returns {boolean}
 */
function isProvided(value) {
	return value !== undefined && value !== false;
}

/**
 * Determine if supplied argument is a string
 *
 * @param  {string}  value
 * @return {boolean}
 */
function isString(value) {
	return typeof value === 'string' || value instanceof String;
}

/**
 * Determine if supplied argument includes a unit
 *
 * @param  {*} value
 * @return {boolean}
 */
function isUnit(value) {
	return /(%|cm|rem|em|ex|in|mm|pc|px|pt|vh|vw|vmin)$/g.test(value);
}

/**
 * Prefixes properties with supplied prefix
 *
 * @param {string} value  un-prefixed string
 * @param {string} prefix prefix
 * @param {Array} ignored
 * @return {[string]}
 */
function prefix(value, prefix, ignored = []) {
	if (prefix === false) {
		return value;
	}

	if (ignored.includes(prefix)) {
		return toDashCase(value);
	}

	return prefix + '-' + toDashCase(value);
}

/**
 * From camel case to dash
 *
 * @return {String} camel case version of supplied string
 */
function toDashCase(value) {
	return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Add deg unit if missing
 *
 * @param {number|string} angle
 * @returns {string}
 */
function toDegrees(angle) {
	return `${angle}`.indexOf('deg') === -1 ?
		`${angle}deg` :
		angle;
}

// TODO: This is replication of Wee's $type. Can we use that instead once integrated?
function type(obj) {
	return obj === undefined ? 'undefined' :
		Object.prototype.toString.call(obj)
			.replace(/^\[object (.+)]$/, '$1')
			.toLowerCase();
}

/**
 * From percentage as string to number
 *
 * @param {string} value
 * @returns {number}
 */
function toNumber(value) {
	return value.replace('%','') / 100;
}

/**
 * From number to percentage as string
 *
 * @param {number} value
 * @returns {string}
 */
function toPercentage(value) {
	return `${value * 100}%`;
}

/**
 * Append default unit to value if value is a unit
 *
 * @param {string|number} value
 * @param {string|number} property
 * @return {string}
 */
function unit(value, property) {
	let ignored = ['font-weight', 'opacity', 'content', 'columns', 'column-count'];

	if (ignored.includes(property) || property === false || value === 0 || /\s/.test(value)) {
		return value.toString();
	}

	if (! isUnit(value) && isNumber(value)) {
		if (property === 'line-height') {
			value += units.lineHeight;
		} else {
			value += units.default;
		}
	}

	return value;
}

module.exports = {
	calcOpacity: calcOpacity,
	isColor: isColor,
	isEmpty: isEmpty,
	isFraction: isFraction,
	isNumber: isNumber,
	isObject: isObject,
	isPercentage: isPercentage,
	isProvided: isProvided,
	isString: isString,
	isUnit: isUnit,
	prefix: prefix,
	setDefaultUnits: setDefaultUnits,
	toDashCase: toDashCase,
	toDegrees: toDegrees,
	toNumber: toNumber,
	toPercentage: toPercentage,
	toRgba: toRgba,
	type: type,
	unit: unit
};