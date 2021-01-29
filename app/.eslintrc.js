const path = require('path')

module.exports = {
    extends: [
        'streamr',
        'plugin:cypress/recommended',
    ],
    parser: 'babel-eslint',
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
        'no-trailing-spaces': 'warn',
        // these promise/atomic rules should probably be turned on
        'promise/catch-or-return': 'off',
        'promise/always-return': 'off',
        'require-atomic-updates': 'off',
        'react/sort-comp': 0,
        'import/order': ['error', {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
                'object',
            ],
            pathGroups: [
                {
                    pattern: '$*/**',
                    group: 'internal',
                    position: 'after',
                },
                {
                    pattern: '@*/**',
                    group: 'internal',
                    position: 'after',
                },
                {
                    pattern: '@*',
                    group: 'internal',
                    position: 'after',
                },
                {
                    pattern: '$*',
                    group: 'internal',
                    position: 'after',
                },
            ],
        }],
    },
    overrides: [{
        files: ['*.jsx', '*.js'],
    }],
}
