const path = require('path')
const webpack = require('webpack')

const postcssImport = require('postcss-import')({
    addDependencyTo: webpack,
    addModulesDirectories: [path.resolve(__dirname, 'src/shared/assets/stylesheets')],
})
const precss = require('precss')
const postcssColorFunction = require('postcss-color-function')
const cssMqpacker = require('css-mqpacker')

module.exports = {
    plugins: [
        postcssImport,
        precss({
            features: {
                // causes some issue in chrome.
                // modern browsers support this anyway
                filter: false,
            },
            importFrom: [
                path.resolve(__dirname, 'src/shared/assets/stylesheets/variables.css'),
                {
                    customMedia: {},
                },
            ],
        }),
        postcssColorFunction,
        cssMqpacker,
    ],
}
