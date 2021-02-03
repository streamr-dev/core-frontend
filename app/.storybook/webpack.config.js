// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProduction = require('../scripts/isProduction')

process.env.NO_DOTENV = true
const origConfig = require('../webpack.config')

module.exports = {
    module: {
        rules: [
            ...origConfig.module.rules,
        ],
    },
    output: {
        publicPath: process.env.STORYBOOK_BASE_PATH || '/',
    },
    devtool: 'source-map',
    plugins: [
        // We use MiniCssExtractPlugin.loader in webpack.config.js. The loader requires the plugin to work so added it manually
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: isProduction() ? '[name].css' : '[name].[hash].css',
            chunkFilename: isProduction() ? '[id].css' : '[id].[hash].css',
        }),
    ],
    resolve: {
        ...origConfig.resolve,
    }
}
