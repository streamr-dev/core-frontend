/* eslint-disable global-require */

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const FlowtypePlugin = require('flowtype-loader/plugin')
const DotenvPlugin = require('dotenv-webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRootPlugin = require('html-webpack-react-root-plugin')

const postcssConfig = require('./postcss.config.js')
const isProduction = require('./src/utils/isProduction')

const root = path.resolve(__dirname)

// The overrides (.env) need to be defined first
if (!isProduction()) {
    require('dotenv').config({
        path: path.resolve(root, '.env'),
    })
}

module.exports = {
    entry: path.resolve(root, 'src', 'index.jsx'),
    output: {
        path: path.resolve(root, 'dist'),
        filename: 'bundle_[hash:6].js',
        // This is for html-webpack-plugin
        publicPath: process.env.MARKETPLACE_BASE_URL || '/',
    },
    resolveLoader: {
        modules: ['node_modules', 'loaders'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(root),
                exclude: /node_modules/,
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                }].concat(!isProduction() ? [{
                    loader: 'flowtype-loader',
                }] : []),
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
            // .pcss files treated as modules
            {
                test: /\.pcss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: isProduction() ? '[local]_[hash:base64:6]' : '[name]_[local]',
                            },
                        }, {
                            loader: 'postcss-loader',
                            options: postcssConfig,
                        },
                    ],
                }),
            },
            // .css files imported as plain css files
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.po$/,
                use: 'po-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Streamr Marketplace',
            filename: path.resolve('dist', 'index.html'),
            inject: true,
        }),
        new ReactRootPlugin(),
        new ExtractTextPlugin({
            filename: 'bundle_[hash:6].css',
            disable: !isProduction(),
        }),
        new DotenvPlugin({
            // If null, only the global env variables (but only the ones used in code) are used
            // So no reason to be feared that other env variables would be visible in UI
            path: isProduction() ? null : path.resolve(root, '.env.common'),
            safe: path.resolve(root, '.env.common'),
            systemvars: true,
        }),
    ].concat(isProduction() ? [
        // Production plugins
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        }),
    ] : [
        // Dev plugins
        new FlowtypePlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackNotifierPlugin(),
    ]),
    devtool: !isProduction() && 'eval-source-map',
    devServer: {
        // contentBase: path.resolve(root, 'src'),
        // watchContentBase: true,
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        port: process.env.PORT || 3333,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
}
