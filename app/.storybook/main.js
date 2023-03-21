const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const appWebpackConfig = require('../webpack.config')
const isProduction = require('../scripts/isProduction')

module.exports = {
    core: {
        builder: 'webpack5',
    },
    stories: [
        '../**/*.stories.tsx',
    ],
    addons: [
        '@storybook/addon-postcss',
        '@storybook/addon-actions',
        '@storybook/addon-viewport',
        '@storybook/addon-controls',
    ],
    webpackFinal: async (config) => {
        config.resolve = appWebpackConfig.resolve
        config.resolve.plugins = [
            ...(config.resolve.plugins || []),
            new TsconfigPathsPlugin({
                extensions: config.resolve.extensions,
            }),
        ]

        config.module.rules = [...appWebpackConfig.module.rules]

        config.plugins.push(
            // We use MiniCssExtractPlugin.loader in webpack.config.js. The loader requires the plugin to work so added it manually
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: isProduction() ? '[name].css' : '[name].[hash].css',
                chunkFilename: isProduction() ? '[id].css' : '[id].[hash].css',
            }),            
        )
        return config
    },
}
