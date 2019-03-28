const path = require('path')
const webpack = require('webpack')
const postcssVariables = require('postcss-variables')

const postcssImport = require('postcss-import')({
    addDependencyTo: webpack,
    addModulesDirectories: [
        path.resolve(__dirname, 'src/shared/assets/stylesheets'),
    ],
})
const postcssCssnext = require('postcss-cssnext')({
    features: {
        // causes some issue in chrome.
        // modern browsers support this anyway
        filter: false,
    },
})
const math = require('postcss-math')
const precss = require('precss')
const postcssColorFunction = require('postcss-color-function')
const cssMqpacker = require('css-mqpacker')
const breakpoints = require('./scripts/breakpoints')

const vars = postcssVariables({
    globals: breakpoints,
})

module.exports = {
    plugins: [
        postcssImport,
        postcssCssnext,
        math,
        precss,
        postcssColorFunction,
        cssMqpacker,
        vars,
    ],
}
