/*
 * NOTE: This file can't be named postcss.config.js. Host projects
 *       with postcss config file that include postcss-math module
 *       fail to start because of duplicated imports. — Mariusz
 */

const postcssImport = require('postcss-import')()
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssColorFunction = require('postcss-color-function')
const postcssMath = require('postcss-math')
const cssMqpacker = require('css-mqpacker')
const vars = require('./postcss-variables')

module.exports = {
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
}
