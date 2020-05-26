const webpack = require('@cypress/webpack-preprocessor')
const webpackOptions = require('../../webpack.config')

module.exports = (on) => {
    on('file:preprocessor', webpack({
        webpackOptions: {
            ...webpack.defaultOptions.webpackOptions,
            resolve: {
                alias: webpackOptions.resolve.alias,
            },
        },
    }))
}
