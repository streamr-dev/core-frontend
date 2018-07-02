const breakpoints = require('../src/breakpoints')

module.exports = require('postcss-variables')({
    globals: breakpoints,
})
