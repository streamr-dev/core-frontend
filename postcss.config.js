const webpack = require('webpack')

module.exports = {
    plugins: [
        require('postcss-import')({
            addDependencyTo: webpack,
        }),
        require('postcss-cssnext'),
        require('precss'),
        require('postcss-nested'),
        require('postcss-color-function'),
        require('css-mqpacker'),
        require('postcss-extend'),
        require('@streamr/streamr-layout/postcss-variables'),
    ]
}
