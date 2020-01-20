const WARN = 1
const ERROR = 2

module.exports = exports = {
    extends: '../../.eslintrc.js',
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
        "import/no-extraneous-dependencies": [ERROR, {
            "devDependencies": [
                "**/*.test.js",
                "**/*.spec.js",
                "**/tests/**/*.js",
                "**/tests/**/*.jsx",
                "**/tests-e2e/**/*.js",
                "**/tests-e2e/**/*.jsx",
            ]
        }],
        "jsx-a11y/label-has-associated-control": [WARN, {
            "required": {
                "some": [ "nesting", "id" ]
            }
        }],
        "jsx-a11y/label-has-for": "off",
        "react/destructuring-assignment": "off",
        "react/jsx-one-expression-per-line": "off",
        "react/sort-comp": "off"
    },
    globals: {
        page: true,
        browser: true,
        jestPuppeteer: true,
    }
}
