const helpers = require('./helpers');

function rule(selector, declarations) {
	return {
		type: 'rule',
		selector: selector,
		declarations: declarations
	};
}

module.exports = rule;