/* eslint-disable global-require */

module.exports = {
    ident: 'postcss',
    plugins: [
        require('postcss-import')({
            addDependencyTo: require('webpack'),
        }),
        require('postcss-cssnext')({
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
