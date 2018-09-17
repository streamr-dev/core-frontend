/* eslint-disable global-require */

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // set a default NODE_ENV

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const StreamrDotenvPlugin = require('./scripts/dotenv.js')

const postcssConfig = require('./postcss.config.js')
const isProduction = require('./src/utils/isProduction')

const root = path.resolve(__dirname)

const dotenvPlugin = StreamrDotenvPlugin(path.resolve(root, '.env.common'), path.resolve(root, '.env'), isProduction())
const gitRevisionPlugin = new GitRevisionPlugin()

const publicPath = process.env.MARKETPLACE_BASE_URL || '/'

const dist = path.resolve(root, 'dist')

module.exports = {
    mode: isProduction() ? 'production' : 'development',
    // babel-polyfill is required to get async-await to work
    entry: ['babel-polyfill', path.resolve(root, 'src', 'index.jsx')],
    output: {
        path: dist,
        filename: 'bundle_[hash:6].js',
        sourceMapFilename: '[file].map',
        publicPath,
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
                }],
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            // Images are put to <BASE_URL>/images
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                    publicPath,
                },
            },
            // Fonts are put to <BASE_URL>/fonts
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                    publicPath,
                },
            },
            // .pcss files treated as modules
            {
                test: /\.pcss$/,
                use: [
                    !isProduction() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: isProduction() ? '[local]_[hash:base64:6]' : '[name]_[local]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: postcssConfig,
                    },
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    !isProduction() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            // po-loader turns .po file into json
            {
                test: /\.po$/,
                use: '@streamr/po-loader',
            },
        ],
    },
    plugins: [
        // Common plugins between prod and dev
        new CleanWebpackPlugin([dist]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: isProduction() ? '[name].css' : '[name].[hash].css',
            chunkFilename: isProduction() ? '[id].css' : '[id].[hash].css',
        }),
        new StyleLintPlugin({
            files: [
                'src/**/*.css',
                'src/**/*.(p|s)css',
            ],
        }),
        dotenvPlugin,
    ].concat(isProduction() ? [
        // Production plugins
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compressor: {
                    warnings: false,
                },
            },
            sourceMap: true,
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
            },
            canPrint: true,
        }),
    ] : [
        // Dev plugins
        new FlowBabelWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackNotifierPlugin(),
        new webpack.EnvironmentPlugin({
            GIT_VERSION: gitRevisionPlugin.version(),
            GIT_COMMIT: gitRevisionPlugin.commithash(),
            GIT_BRANCH: gitRevisionPlugin.branch(),
        }),
    ]),
    devtool: isProduction() ? 'source-map' : 'eval-source-map',
    devServer: {
        historyApiFallback: {
            index: publicPath,
        },
        hot: true,
        inline: true,
        progress: true,
        port: process.env.PORT || 3333,
        publicPath,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        symlinks: false
    },
}
