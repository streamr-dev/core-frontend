const env = process.env.NODE_ENV || 'development'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FlowtypePlugin = require('flowtype-loader/plugin')
const pcssLoaderOptions = {
    ...require('./.postcss'),
    ident: 'postcss',
}

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
                            options: pcssLoaderOptions,
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
                        {
                            loader: 'postcss-loader',
                            options: pcssLoaderOptions,
                        },
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
        'react-in-viewport',
        'reactstrap',
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
}
