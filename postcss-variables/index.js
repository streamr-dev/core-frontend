const breakpoints = require('../breakpoints')

module.exports = require('postcss-variables')({
    globals: breakpoints,
})
