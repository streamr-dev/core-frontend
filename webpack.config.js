const env = process.env.NODE_ENV || 'development'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FlowtypePlugin = require('flowtype-loader/plugin')
const postcssImport = require('postcss-import')()
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssColorFunction = require('postcss-color-function')
const postcssMath = require('postcss-math')
const cssMqpacker = require('css-mqpacker')
const vars = require('./postcss-variables')

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        sourceMapFilename: '[file].map',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname),
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    'eslint-loader',
                ].concat(env !== 'production' ? ['flowtype-loader'] : []),
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
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
                                localIdentName: env === 'development' ? '[name]_[local]' : '[local]_[hash:base64:6]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    postcssImport,
                                    precss,
                                    autoprefixer,
                                    postcssNested,
                                    postcssColorFunction,
                                    postcssMath,
                                    cssMqpacker,
                                    vars,
                                ],
                            },
                        }
                    ],
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('bundle.css'),
    ].concat(env === 'production' ? [
        // plugins for production
    ] : [
        new FlowtypePlugin(),
    ]),
    externals: [
        'classnames',
        'react',
        'react-dom',
        'reactstrap',
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
}
