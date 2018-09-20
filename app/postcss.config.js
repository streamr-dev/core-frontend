const postcssImport = require('postcss-import')({
    addDependencyTo: require('webpack'),
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
const postcssNested = require('postcss-nested')
const postcssColorFunction = require('postcss-color-function')
const cssMqpacker = require('css-mqpacker')
const extend = require('postcss-extend')
const breakpoints = require('./scripts/breakpoints')
const vars = require('postcss-variables')({
    globals: breakpoints,
})

module.exports = {
    plugins: [
        postcssImport,
        postcssCssnext,
        math,
        precss,
        postcssNested,
        postcssColorFunction,
        cssMqpacker,
        extend,
        vars,
    ],
}
