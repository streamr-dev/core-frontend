module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-css-modules',
    ],
    plugins: [
        'stylelint-scss',
    ],
    defaultSeverity: 'error',
    rules: {
        'at-rule-no-vendor-prefix': true,
        'block-no-empty': null,
        'color-hex-case': ['upper'],
        'color-hex-length': 'long',
        'function-url-quotes': 'always',
        'max-nesting-depth': 3,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'string-quotes': 'single',
        'value-no-vendor-prefix': true,
    },
    ignoreFiles: [
        'node_modules/**',
    ],
}
