const path = require('path')
const webpack = require('webpack')
const postcssVariables = require('postcss-variables')

const postcssImport = require('postcss-import')({
    addDependencyTo: webpack,
    addModulesDirectories: [
        path.resolve(__dirname, 'src/shared/assets/stylesheets'),
    ],
})
const calc = require('postcss-calc')
const precss = require('precss')
const postcssColorFunction = require('postcss-color-function')
const cssMqpacker = require('css-mqpacker')
const breakpoints = require('./scripts/breakpoints')

module.exports = {
    plugins: [
        postcssImport,
        precss({
            features: {
                // causes some issue in chrome.
                // modern browsers support this anyway
                filter: false,
            },
        }),
        calc, // Has to go after precss.
        postcssColorFunction,
        cssMqpacker,
        postcssVariables({
            globals: breakpoints,
        }),
    ],
}
