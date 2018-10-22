// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config
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
    resolve: {
        ...origConfig.resolve,
    }
}
