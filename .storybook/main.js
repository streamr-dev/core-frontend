const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const appWebpackConfig = require('../webpack.config')
const isProduction = require('../scripts/isProduction')

module.exports = {
    core: {
        builder: 'webpack5',
    },
    stories: ['../src/**/*.stories.tsx', '../stories/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-viewport',
        '@storybook/addon-controls',
        '@storybook/addon-webpack5-compiler-babel',
        '@chromatic-com/storybook'
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
        config.plugins.push(
            // Work around for Buffer is undefined:
            // https://github.com/webpack/changelog-v5/issues/10
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
        )

        return config
    },
    framework: {
        name: '@storybook/react-webpack5',
        options: { fastRefresh: true },
    },
}
