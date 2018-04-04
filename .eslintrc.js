const DISABLED = 0
const WARN = 1
const ERROR = 2

module.exports = exports = {
    extends: [
        'eslint:recommended',
        'airbnb',
        'plugin:flowtype/recommended'
    ],
    parser: 'babel-eslint',
    env: {
        browser: true,
        jest: true
    },
    plugins: [
        'react',
        'flowtype'
    ],
    settings: {
        onlyFilesWithFlowAnnotation: true
    },
    rules: {
        'arrow-parens': [ERROR, 'always', {
            requireForBlockBody: false
        }],
        'flowtype/define-flow-type': ERROR,
        'flowtype/newline-after-flow-annotation': [ERROR, 'always'],
        'import/extensions': [ERROR, 'always', {
            'js': 'never',
            'jsx': 'never',
            'json': 'never',
        }],
        'import/first': DISABLED,
        'import/no-named-as-default': DISABLED,
        'import/prefer-default-export': DISABLED,
        'indent': [ERROR, 4, {
            SwitchCase: WARN,
            MemberExpression: WARN,
            ObjectExpression: WARN
        }],
        'jsx-a11y/anchor-is-valid': DISABLED,
        'max-len': [ERROR, { code: 150 }],
        'no-console': [WARN, { allow: ['warn', 'error'] }],
        'no-debugger': WARN,
        'no-multiple-empty-lines': [ERROR, {
            max: 1,
            maxBOF: 0
        }],
        'no-self-compare': DISABLED,
        'object-curly-newline': [ERROR, {
            ObjectExpression: {
                minProperties: 1
            },
            ObjectPattern: {
                minProperties: 5
            }
        }],
        'quote-props': [ERROR, 'as-needed', {
            numbers: true
        }],
        'react/default-props-match-prop-types': DISABLED,
        'react/jsx-indent': [ERROR, 4],
        'react/jsx-indent-props': [ERROR, 4],
        'react/require-default-props': DISABLED,
        'semi': [ERROR, 'never'],
    }
}
