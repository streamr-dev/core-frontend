// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')
process.env.NO_DOTENV = true
const origConfig = require('../webpack.config')

module.exports = {
    plugins: [
        ...origConfig.plugins,
    ],
    module: {
        rules: [
            ...origConfig.module.rules,
        ],
    },
    plugins: [
        new FlowBabelWebpackPlugin(),
    ],
    resolve: {
        ...origConfig.resolve,
    }
}
