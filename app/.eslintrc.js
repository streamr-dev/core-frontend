const path = require('path')

module.exports = exports = {
    extends: [
        'streamr',
        'plugin:cypress/recommended',
    ],
    settings: {
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, 'webpack.config.js'),
            },
        },
    },
    plugins: [
        'react-hooks',
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'warn',
        'no-multiple-empty-lines': 'warn',
        'jsx-a11y/no-noninteractive-tabindex': 'warn',
        'react/jsx-indent': 'warn',
        'max-len': 'warn',
        'flowtype/no-flow-fix-me-comments': ['warn', '\\s.+'],
        'react/prop-types': 0,
        'no-unreachable': 'warn',
        'object-curly-newline': 'warn',
    }
}
