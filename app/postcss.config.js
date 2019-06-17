const path = require('path')
const webpack = require('webpack')

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
const ums = require('./scripts/postcss/ums')
const {
    xs,
    sm,
    md,
    lg,
    xl,
} = require('./scripts/breakpoints')

module.exports = {
    plugins: [
        ums,
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
                    customMedia: {
                        '--xs': `(max-width: ${xs.max}px)`,
                        '--sm-up': `(min-width: ${sm.min}px)`,
                        '--sm-down': `(max-width: ${sm.max}px)`,
                        '--md-up': `(min-width: ${md.min}px)`,
                        '--md-down': `(max-width: ${md.max}px)`,
                        '--lg-up': `(min-width: ${lg.min}px)`,
                        '--lg-down': `(max-width: ${lg.max}px)`,
                        '--xl': `(min-width: ${xl.min}px)`,
                        '--retina': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
                    },
                },
            ],
        }),
        calc, // Has to go after precss.
        postcssColorFunction,
        cssMqpacker,
    ],
}
