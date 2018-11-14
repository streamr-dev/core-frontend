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
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const cssProcessor = require('cssnano')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const dotenv = require('./scripts/dotenv.js')()

const isProduction = require('./scripts/isProduction')

const root = path.resolve(__dirname)
const gitRevisionPlugin = new GitRevisionPlugin()
const publicPath = process.env.PLATFORM_BASE_PATH || '/'
const dist = path.resolve(root, 'dist')

module.exports = {
    mode: isProduction() ? 'production' : 'development',
    // babel-polyfill is required to get async-await to work
    entry: [
        'babel-polyfill',
        // forcibly print diagnostics upfront
        path.resolve(root, 'src', 'shared', 'utils', 'diagnostics.js'),
        path.resolve(root, 'src', 'index.jsx'),
    ],
    output: {
        path: dist,
        filename: 'bundle_[hash:6].js',
        sourceMapFilename: '[file].map',
        publicPath,
    },
    module: {
        rules: [
            {
                test: /\.mdx?$/,
                use: [
                    'babel-loader',
                    '@mdx-js/loader',
                ],
            },
            {
                test: /\.jsx?$/,
                include: [path.resolve(root, 'src'), path.resolve(root, 'scripts')],
                enforce: 'pre',
                use: [{
                    loader: 'eslint-loader',
                    options: {
                        cache: !isProduction(),
                    },
                }],
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: [path.resolve(root, 'src'), path.resolve(root, 'scripts'), /node_modules\/stringify-object/, /node_modules\/query-string/],
                options: {
                    cacheDirectory: !isProduction(),
                },
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
                            localIdentRegExp: /app\/src\/([^/]+)/i,
                            localIdentName: isProduction() ? '[local]_[hash:base64:6]' : '[1]_[name]_[local]',
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    !isProduction() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                path.resolve(__dirname, 'src/shared/assets/stylesheets'),
                            ],
                        },
                    },
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
            templateParameters: {
                gaId: process.env.GOOGLE_ANALYTICS_ID,
            },
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
        new webpack.EnvironmentPlugin(dotenv),
    ].concat(isProduction() ? [
        // Production plugins
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                parallel: true,
                compressor: {
                    warnings: false,
                },
            },
            sourceMap: true,
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
            },
            canPrint: true,
        }),
    ] : [
        // Dev plugins
        new UnusedFilesWebpackPlugin({
            patterns: [
                'src/marketplace/**/*.*',
                'src/shared/**/*.*',
                'src/routes/**/*.*',
                process.env.USERPAGES === 'on' && 'src/userpages/**/*.*',
                process.env.USERPAGES === 'on' && 'src/editor/**/*.*',
                process.env.DOCS === 'on' && 'src/docs/**/*.*',
            ].filter(Boolean),
            globOptions: {
                ignore: [
                    'node_modules/**/*.*',
                    // skip tests
                    '**/tests/*.*',
                    '**/tests/**/*.*',
                    // skip flowtype
                    '**/flowtype/**/*.*',
                    '**/flowtype/*.*',
                    '**/types.js',
                    // skip conditional stubs
                    '**/stub.jsx',
                ],
            },
        }),
        new FlowBabelWebpackPlugin(),
        new WebpackNotifierPlugin(),
        new webpack.EnvironmentPlugin({
            GIT_VERSION: gitRevisionPlugin.version(),
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
        symlinks: false,
        alias: {
            // Make sure you set up aliases in flow and jest configs.
            $app: __dirname,
            $auth: path.resolve(__dirname, 'src/auth/'),
            $mp: path.resolve(__dirname, 'src/marketplace/'),
            $userpages: path.resolve(__dirname, 'src/userpages/'),
            $shared: path.resolve(__dirname, 'src/shared/'),
            $testUtils: path.resolve(__dirname, 'test/test-utils/'),
            $routes: path.resolve(__dirname, 'src/routes'),
            $utils: path.resolve(__dirname, 'src/utils/'),
            // When duplicate bundles point to different places.
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
            'eth-lib': path.resolve(__dirname, 'node_modules/eth-lib'),
            eventemitter3: path.resolve(__dirname, 'node_modules/eventemitter3'),
            'hoist-non-react-statics': path.resolve(__dirname, 'node_modules/hoist-non-react-statics'),
            invariant: path.resolve(__dirname, 'node_modules/invariant'),
            isarray: path.resolve(__dirname, 'node_modules/isarray'),
            'query-string': path.resolve(__dirname, 'node_modules/query-string'),
            'regenerator-runtime': path.resolve(__dirname, 'node_modules/regenerator-runtime'),
            'strict-uri-encode': path.resolve(__dirname, 'node_modules/strict-uri-encode'),
            warning: path.resolve(__dirname, 'node_modules/warning'),
            underscore: path.resolve(__dirname, 'node_modules/underscore'),
        },
    },
}
