const path = require('path')

module.exports = {
    extends: ['plugin:react/recommended', 'streamr-ts', 'plugin:cypress/recommended'],
    parser: '@typescript-eslint/parser',
    settings: {
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, 'webpack.config.js'),
            },
        },
    },
    plugins: ['react-hooks', 'import', 'react', 'jsx-a11y'],
    rules: {
        'prefer-const': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'off', // as we prefer the typescript version of this rule
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'no-multiple-empty-lines': 'warn',
        'jsx-a11y/no-noninteractive-tabindex': 'warn',
        'react/jsx-indent': 'warn',
        'max-len': 'warn',
        'react/prop-types': 0,
        'no-unreachable': 'warn',
        'object-curly-newline': 0,
        'no-trailing-spaces': 'warn',
        'no-void': 'off',
        // these promise/atomic rules should probably be turned on
        'promise/catch-or-return': 'off',
        'promise/always-return': 'off',
        'require-atomic-updates': 'off',
        'react/sort-comp': 0,
        "react/no-unknown-property": ['error', { ignore: ['css'] }],
        'import/extensions': 'off',
        'import/order': [
            'warn',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
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
            },
        ],
        indent: 'off',
        '@typescript-eslint/explicit-module-boundary-types': [
            'off', // TODO - change to 'error' in the future
            {
                allowArgumentsExplicitlyTypedAsAny: true,
            },
        ],
    },
    overrides: [
        {
            files: ['*.tsx', '*.ts', '*.js'],
        },
    ],
}
