const BaseParser = require('postcss/lib/parser');
const Mixin = require('./Mixin');

/**
 * Convert array of arguments into set of key: value pairs
 *
 * @param {array} args
 * @returns {object}
 */
function convertToObject(args) {
	let result = {};

	args.forEach((arg, i) => {
		if (Array.isArray(arg)) {
			result[arg[0]] = arg[1];
		} else {
			if (i % 2 === 0) {
				result[arg] = undefined;
			} else {
				result[args[i - 1]] = arg;
			}
		}
	});

	return result;
}

class Parser extends BaseParser {
	other(start) {
		let end      = false;
        let type     = null;
        let colon    = false;
        let bracket  = null;
        let brackets = [];
		let hasBracket = false;
		
		let tokens = [];
		let token = start;

		while (token) {
			type = token[0];
			tokens.push(token);

			if (type === '(' || type === '[') {
				if (! bracket) bracket = token;
				brackets.push(type === '(' ? ')' : ']');
				hasBracket = true;
			} else if (type === 'brackets') {
				hasBracket = true;
			} else if (brackets.length === 0) {
				if ( type === ';' ) {
                    if ( colon ) {
                        this.decl(tokens);
                        return;
                    } else if (hasBracket) {
						this.mixin(tokens); // TODO: this.tokens.slice(start, this.pos + 1)
						return;
					} else {
						break;
					}
                } else if ( type === '{' ) {
                    this.rule(tokens);
                    return;

                } else if ( type === '}' ) {
                    this.tokenizer.back(tokens.pop());
                    end = true;
                    break;

                } else if ( type === ':' ) {
                    colon = true;
                }
			} else if ( type === brackets[brackets.length - 1] ) {
                brackets.pop();
                if ( brackets.length === 0 ) bracket = null;
            }
			
			token = this.tokenizer.nextToken();
		}
		
		if ( this.tokenizer.endOfFile() ) end = true;
		if ( brackets.length > 0 ) this.unclosedBracket(bracket);
		
		if ( end && colon ) {
            while ( tokens.length ) {
                token = tokens[tokens.length - 1][0];
                if ( token !== 'space' && token !== 'comment' ) break;
                this.tokenizer.back(tokens.pop());
            }
            this.decl(tokens);
            return;
        } else {
            this.unknownWord(tokens);
        }
	}

	mixin(tokens) {		
		let node = new Mixin(),
			last;

		this.init(node);

		last = tokens[tokens.length - 1];

		// Detect semi-colon at end of mixin
		if (last[0] === ';') {
			// TODO: this.semicolon is not being used in stringifier currently
			this.semicolon = true;
			tokens.pop();
		}

		// Establish end of mixin
		node.source.end = {
			line: last[2],
			column: last[3]
		};

		// Add raw 'before' characters
		while (tokens[0][0] !== 'word') {
			node.raws.before += tokens.shift()[1];
		}

		// Establish start of mixin
		node.source.start = {
			line: tokens[0][2],
			column: tokens[0][3]
		};

		// Define mixin name
		node.name = tokens.shift()[1];
		node.raws.between = '';

		this.raw(node, 'arguments', tokens);

		let value = this.mixinArguments(tokens);
		node.fontArgs = value.fontArgs;
		node.raws.arguments = { value: value.args, raw: tokens };
		node.arguments = value.args;
	}

	/**
	 * Parse mixin arguments
	 *
	 * @param {array} tokens
	 * @returns {{args: *, fontArgs: {}}}
	 */
	mixinArguments(tokens) {
		let args = {
				ordered: [],
				named: {}
			},
			objectArgs = false,
			namedKey = false,
			namedValue = false,
			fontArgs = {};

		if (tokens[0][0] === 'brackets') {
			tokens[0][1].replace(/^\(/, '')
				.replace(/\)$/, '')
				.split(',')
				.forEach(arg => {
					if (arg.includes(': ')) {
						let props = arg.split(': ').map(prop => {
								return prop.trim();
							});

						args.named[props[0]] = props[1];
						return;
					}

					return args.ordered.push(arg.trim());
				});
		} else if (tokens[0][0] === '(') {
			let string = '',
				font = false,
				fontStack = [];

			tokens.shift();
			tokens.pop();

			for (let i = 0; i < tokens.length; i++) {
				let token = tokens[i],
					type = token[0];

				// Filter out spaces and commas
				if (/^\s$|^,$/g.test(token[1])) {
					continue;
				}

				if (type === ':') {
					objectArgs = true;
				}

				// End of font family stack
				if (type === ']') {
					if (namedValue) {
						args.named[namedKey] = fontStack.join(', ');
					} else {
						args.ordered.push(fontStack.join(', '));
					}

					// Reset font variables
					fontStack = [];
					font = false;
					continue;
				}

				// Concatenate font family argument together
				if (font) {
					if (objectArgs) {
						namedKey = args.ordered.pop();
						namedValue = true;
						fontArgs[namedKey] = true;
						objectArgs = false;
					} else {
						if (namedValue) {
							fontArgs[namedKey] = true;
						} else {
							fontArgs[args.ordered.length] = true;
						}
					}

					fontStack.push(token[1].replace(/,$/, ''));
					continue;
				}

				// Identify font family stack
				if (type === '[') {
					font = true;
					continue;
				}

				// If key: value is identified, key is at end of ordered array
				if (objectArgs && (type === 'string' || type === 'word')) {
					namedKey = args.ordered.pop();
					args.named[namedKey] = token[1].replace(/,$/, '');
					namedValue = true;
					objectArgs = false;
					continue;
				}

				if (type === 'word') {
					args.ordered.push(token[1].replace(/,$/, ''));
				}

				// Put CSS function together
				if (type === '(') {
					if (namedValue) {
						args.named[namedKey] += token[1];
					} else {
						args.ordered[args.ordered.length - 1] += token[1];
					}
				}

				// End of CSS function
				if (type === ')') {
					if (namedValue) {
						args.named[namedKey] += token[1];
						namedValue = false;
					} else {
						args.ordered[args.ordered.length - 1] += token[1];
					}
				}

				if (type === 'string') {
					// Determine if we are dealing with CSS function argument
					if (tokens[i - 1] && tokens[i - 1][0] === '(') {
						if (namedValue) {
							args.named[namedKey] += token[1];
						} else {
							args.ordered[args.ordered.length - 1] += token[1];
						}
					} else {
						if (namedValue) {
							args.named[namedKey] = token[1];
						} else {
							args.ordered.push(token[1]);
						}
					}
				}

				if (type === 'brackets') {
					// Determine if we are at the start of CSS function
					if (tokens[i - 1] && tokens[i - 1][0] === 'word') {
						if (namedValue) {
							args.named[namedKey] += token[1];
						} else {
							// Put CSS function together
							args.ordered[args.ordered.length - 1] += token[1];
						}
					} else {
						if (namedValue) {
							args.named[namedKey] = token[1];
						} else {
							// Put CSS function together
							args.ordered.push(token[1]);
						}

					}
				}
			}
		}

		return {
			args: args,
			fontArgs: fontArgs
		};
	}
}

module.exports = Parser;