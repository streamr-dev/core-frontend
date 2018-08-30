const postcssImport = require('postcss-import')()
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssColorFunction = require('postcss-color-function')
const cssMqpacker = require('css-mqpacker')
const vars = require('./postcss-variables')

module.exports = {
    plugins: [
        postcssImport,
        precss,
        autoprefixer,
        postcssNested,
        postcssColorFunction,
        cssMqpacker,
        vars,
    ],
}
