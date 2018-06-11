/* eslint-disable global-require, import/no-dynamic-require */

module.exports = {
    plugins: [
        require('postcss-flexbugs-fixes'),
        require('precss'),
        require('autoprefixer')({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
        }),
        require('postcss-nested'),
        require('postcss-color-function'),
        require('css-mqpacker'),
        require('postcss-extend'),
    ],
}
