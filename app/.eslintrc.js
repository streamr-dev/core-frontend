const path = require('path')

module.exports = {
    extends: ['plugin:react/recommended', 'streamr-ts', 'plugin:cypress/recommended', 'prettier'],
    parser: 'babel-eslint',
    settings: {
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, 'webpack.config.js'),
            },
        },
    },
    plugins: ['react-hooks', 'import', 'react', 'jsx-a11y'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'warn',
        'no-multiple-empty-lines': 'warn',
        'jsx-a11y/no-noninteractive-tabindex': 'warn',
        'react/jsx-indent': 'warn',
        'max-len': 'warn',
        'react/prop-types': 0,
        'no-unreachable': 'warn',
        'object-curly-newline': 'warn',
        'no-trailing-spaces': 'warn',
        'no-void': 'off',
        // these promise/atomic rules should probably be turned on
        'promise/catch-or-return': 'off',
        'promise/always-return': 'off',
        'require-atomic-updates': 'off',
        'react/sort-comp': 0,
        'import/extensions': 'off',
    },
    overrides: [
        {
            files: ['*.tsx', '*.ts', '*.js'],
        },
    ],
}
