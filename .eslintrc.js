const WARN = 1
const ERROR = 2

module.exports = exports = {
    extends: 'streamr',
    rules: {
        "consistent-return": "off",
        'object-curly-newline': [ERROR, {
            ObjectExpression: {
                minProperties: 2,
                consistent: true
            },
            ObjectPattern: {
                minProperties: 5
            }
        }],
        "no-param-reassign": "off",
        "no-shadow": "off",
        "react/no-multi-comp": "off",
        "react/prop-types": "off",
        "react/no-unused-prop-types": "off",
        "react/prefer-stateless-function": "off",
        "jsx-a11y/label-has-associated-control": [WARN, {
            "controlComponents": ["FormControl"],
            "required": {
                "some": [ "nesting", "id" ]
            }
        }],
        "jsx-a11y/label-has-for": "off"
    },
    globals: {
        page: true,
        browser: true,
        jestPuppeteer: true,
    },
}
