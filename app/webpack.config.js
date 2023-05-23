process.env.NODE_ENV = process.env.NODE_ENV || 'development' // set a default NODE_ENV
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const StyleLintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DeadCodePlugin = require('webpack-deadcode-plugin')
const cssProcessor = require('clean-css')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const SentryPlugin = require('@sentry/webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default
const validateEnv = require('./scripts/validateEnv')
const pkg = require('./package')

const dotenv = require('./scripts/dotenv')

const loadedDotenv = !process.env.NO_DOTENV ? dotenv() : []
const analyze = !!process.env.BUNDLE_ANALYSIS
const styledComponentsTransformer = createStyledComponentsTransformer()

const isProduction = require('./scripts/isProduction')

const root = path.resolve(__dirname)
const dist = path.resolve(root, 'dist')
const gitRevisionPlugin = new GitRevisionPlugin({
    gitWorkTree: path.resolve(root, '..'),
})

if (isProduction() && !process.env.STORYBOOK) {
    validateEnv(process.env)
}

// We have to make sure that publicPath ends with a slash. If it
// doesn't then chunks are not gonna load correctly. #codesplitting
const publicPath = `${process.env.PLATFORM_PUBLIC_PATH || ''}/`
module.exports = {
    mode: isProduction() ? 'production' : 'development',
    entry: [
        // forcibly print diagnostics upfront
        path.resolve(root, 'src', 'shared', 'utils', 'diagnostics.ts'),
        // always load setup first
        path.resolve(root, 'src', 'setup.ts'),
        path.resolve(root, 'src', 'index.tsx'),
    ],
    output: {
        path: dist,
        filename: 'bundle_[name]_[hash:8].js',
        chunkFilename: '[name].bundle_[contenthash:8].js',
        sourceMapFilename: '[name]_[hash:8].map',
        publicPath,
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => (
                                {
                                    before: [styledComponentsTransformer]
                                }
                            ),
                        },
                    },
                ],
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: [path.resolve(root, 'src'), path.resolve(root, 'scripts')],
                options: {
                    rootMode: 'upward',
                    cacheDirectory: !isProduction(),
                    compact: isProduction(),
                },
            },
            {
                test: /\.md$/,
                loader: 'raw-loader',
            },
            // Images are put to <BASE_URL>/images
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                type: 'asset/resource',
            },
            // Videos are put to <BASE_URL>/videos
            {
                test: /\.(mp4)$/,
                loader: 'file-loader',
                options: {
                    name: 'videos/[name]_[hash:8].[ext]',
                    publicPath,
                },
            },
            // Fonts are put to <BASE_URL>/fonts
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                type: 'asset/resource',
            },
            // .pcss files treated as modules
            {
                test: /\.pcss$/,
                use: [
                    !isProduction() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentRegExp: /app\/src\/([^/]+)/i,
                                localIdentName: isProduction() ? '[local]_[hash:base64:8]' : '[1]_[name]_[local]',
                            },
                            importLoaders: 1,
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
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'src/shared/assets/stylesheets')],
                            }
                        },
                    },
                ],
            },
            // po-loader turns .po file into json
            {
                test: /\.po$/,
                loader: '@streamr/po-loader',
                options: {
                    keyseparator: '.',
                },
            },
            {
                test: /\.toml$/,
                loader: 'toml-loader',
            },
        ],
    },
    plugins: [
        // Common plugins between prod and dev
        new ESLintPlugin({
            extensions: ['tsx', 'ts'],
        }),
        // TODO: Disable logging of typescript errors for now as there's so many of them.
        // new ForkTsCheckerWebpackPlugin({
        //     issue: {
        //         include: [
        //             { file: '**/src/**/*' }
        //         ],
        //     },
        // }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            templateParameters: {
                gaId: process.env.GOOGLE_ANALYTICS_ID,
                version: pkg.version,
            },
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: !isProduction() ? '[name].css' : '[name].[contenthash:8].css',
            chunkFilename: !isProduction() ? '[id].css' : '[id].[contenthash:8].css',
        }),
        new StyleLintPlugin({
            files: ['src/**/*.css', 'src/**/*.(p|s)css'],
        }),
        new webpack.EnvironmentPlugin({
            GIT_VERSION: gitRevisionPlugin.version(),
            GIT_BRANCH: gitRevisionPlugin.branch(),
            SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || '',
            SENTRY_DSN: process.env.SENTRY_DSN || '',
            VERSION: process.env.VERSION || '',
            TRAVIS_TAG: process.env.TRAVIS_TAG || '',
            TRAVIS_PULL_REQUEST_BRANCH: process.env.TRAVIS_PULL_REQUEST_BRANCH || '',
            TRAVIS_BRANCH: process.env.TRAVIS_BRANCH || '',
            TRAVIS_COMMIT: process.env.TRAVIS_COMMIT || '',
            TRAVIS_PULL_REQUEST_SHA: process.env.TRAVIS_PULL_REQUEST_SHA || '',
            STREAMR_DOCKER_DEV_HOST: process.env.STREAMR_DOCKER_DEV_HOST || '',
            GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
        }),
        new webpack.EnvironmentPlugin(loadedDotenv),
        ...(analyze
            ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                }),
            ]
            : []),
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        // Fix process is not defined error
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ]
        .concat(
            isProduction()
                ? [
                    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: [dist]}),
                    // Production plugins
                    // new webpack.optimize.OccurrenceOrderPlugin(), // commented out as it started throwing errors after update to webpack5
                    new webpack.EnvironmentPlugin({
                        NODE_ENV: 'production',
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
                    new ImageminPlugin({
                        disable: !isProduction(), // Disable during development
                        pngquant: {
                            quality: '50-75',
                        },
                    }),
                ]
                : [
                    // Dev plugins
                    new DeadCodePlugin({
                        patterns: [
                            'src/marketplace/**/*.*',
                            'src/shared/**/*.*',
                            'src/routes/**/*.*',
                            'src/userpages/**/*.*',
                            'src/*.*',
                        ],
                        exclude: [
                            'node_modules/**/*.*',
                            // skip tests
                            '**/tests/*.*',
                            '**/tests/**/*.*',
                            '**/test/*.*',
                            '**/test/**/*.*',
                            '**/*.test.ts',
                            '**/*.test.tsx',
                            // skip conditional stubs
                            '**/stub.tsx',
                            // skip stories
                            '**/*.stories.*',
                            // skip sketch files
                            '**/*.sketch',
                        ],
                    }),
                    new WebpackNotifierPlugin(),
                ],
        )
        .concat(
            process.env.SENTRY_DSN
                ? [
                    new SentryPlugin({
                        include: dist,
                        validate: true,
                        ignore: [
                            '.cache',
                            '.DS_STORE',
                            '.env',
                            '.storybook',
                            'bin',
                            'coverage',
                            'node_modules',
                            'scripts',
                            'stories',
                            'test',
                            'travis_scripts',
                            'webpack.config.js',
                        ],
                        release: process.env.VERSION,
                    }),
                ]
                : [],
        ),
    devtool: isProduction() ? 'source-map' : 'eval-source-map',
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        historyApiFallback: {
            index: publicPath,
            disableDotRule: true,
        },
        hot: true,
        // inline: true,
        // progress: true,
        port: process.env.PORT || 3333,
    },
    // automatically creates a vendor chunk & also
    // seems to prevent out of memory errors during dev ??
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        symlinks: false,
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer"),
        },
        alias: {
            // Make sure you set up aliases in flow and jest configs.
            $app: __dirname,
            $mp: path.resolve(__dirname, 'src/marketplace/'),
            $userpages: path.resolve(__dirname, 'src/userpages/'),
            $shared: path.resolve(__dirname, 'src/shared/'),
            $testUtils: path.resolve(__dirname, 'test/test-utils/'),
            $routes: path.resolve(__dirname, 'src/routes/'),
            $utils: path.resolve(__dirname, 'src/utils/'),
            $ui: path.resolve(__dirname, 'src/shared/components/Ui'),
            $config: path.resolve(__dirname, `src/config/${process.env.HUB_CONFIG_ENV || process.env.NODE_ENV}.toml`),
            // When duplicate bundles point to different places.
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
            'eth-lib': path.resolve(__dirname, 'node_modules/eth-lib'),
            eventemitter3: path.resolve(__dirname, 'node_modules/eventemitter3'),
            invariant: path.resolve(__dirname, 'node_modules/invariant'),
            isarray: path.resolve(__dirname, 'node_modules/isarray'),
            'query-string': path.resolve(__dirname, 'node_modules/query-string'),
            'regenerator-runtime': path.resolve(__dirname, 'node_modules/regenerator-runtime'),
            'strict-uri-encode': path.resolve(__dirname, 'node_modules/strict-uri-encode'),
            warning: path.resolve(__dirname, 'node_modules/warning'),
            underscore: path.resolve(__dirname, 'node_modules/underscore'),
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
        },
    },
}
