/* eslint-disable global-require, import/no-dynamic-require */

module.exports = {
    plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-import')({
            addDependencyTo: require('webpack'),
        }),
        require('postcss-cssnext')({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
            features: {
                // causes some issue in chrome.
                // modern browsers support this anyway
                filter: false,
            },
        }),
        require('postcss-math'),
        require('postcss-nested'),
        require('postcss-color-function'),
        require('css-mqpacker'),
        require('postcss-extend'),
        require('@streamr/streamr-layout/postcss-variables'),
    ],
}
