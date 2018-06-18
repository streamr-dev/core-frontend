/* eslint-disable global-require */

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // set a default NODE_ENV

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const FlowtypePlugin = require('flowtype-loader/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRootPlugin = require('html-webpack-react-root-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const StreamrDotenvPlugin = require('./scripts/dotenv.js')

const postcssConfig = require('./postcss.config.js')
const isProduction = require('./src/utils/isProduction')

const root = path.resolve(__dirname)

const dotenvPlugin = StreamrDotenvPlugin(path.resolve(root, '.env.common'), path.resolve(root, '.env'), isProduction())
const gitRevisionPlugin = new GitRevisionPlugin()

const publicPath = process.env.MARKETPLACE_BASE_URL || '/'

module.exports = {
    entry: path.resolve(root, 'src', 'index.jsx'),
    output: {
        path: path.resolve(root, 'dist'),
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
                }].concat(!isProduction() ? [{
                    loader: 'flowtype-loader',
                }] : []),
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
            {
                test: /\.(scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    }, {
                        loader: 'postcss-loader', // Run post css actions
                    }, {
                        loader: 'sass-loader', // compiles Sass to CSS
                    }],
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
            // po-loader turns .po file into json
            {
                test: /\.po$/,
                use: '@streamr/po-loader',
            },
        ],
    },
    plugins: [
        // Common plugins between prod and dev
        new HtmlWebpackPlugin({
            title: 'Streamr Marketplace',
            filename: path.resolve('dist', 'index.html'),
        }),
        new ReactRootPlugin(),
        new ExtractTextPlugin({
            filename: 'bundle_[hash:6].css',
            disable: !isProduction(),
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
        new FlowtypePlugin(),
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
    },
}
