const path = require('path')
const webpack = require('webpack')

const postcssImport = require('postcss-import')({
    addDependencyTo: webpack,
    addModulesDirectories: [path.resolve(__dirname, 'app/src/shared/assets/stylesheets')],
})
const calc = require('postcss-calc')
const postcssColorFunction = require('postcss-color-function')
const postCssJitProps = require('postcss-jit-props')
const cssMqpacker = require('css-mqpacker')
const postcssPresetEnv = require('postcss-preset-env')
const postcssNested = require('postcss-nested')
const ums = require('./scripts/postcss/ums')
const { xs, sm, md, lg, xl } = require('./scripts/breakpoints')

module.exports = {
    plugins: [
        ums,
        postcssImport,
        postCssJitProps({
            files: [
                path.resolve(__dirname, 'app/src/shared/assets/stylesheets/variables.css'),
            ],
            '--xs': `@custom-media --xs (max-width: ${xs.max}px);`,
            '--sm-up': `@custom-media --sm-up (max-width: ${sm.min}px);`,
            '--sm-down': `@custom-media --sm-down (max-width: ${sm.max}px);`,
            '--md-up': `@custom-media --md-up (max-width: ${md.min}px);`,
            '--md-down': `@custom-media --md-down (max-width: ${md.max}px);`,
            '--lg-up': `@custom-media --lg-up (max-width: ${lg.min}px);`,
            '--lg-down': `@custom-media --lg-down (max-width: ${lg.max}px);`,
            '--xl': `@custom-media --xl (max-width: ${xl.min}px);`,
            '--retina': `@custom-media --retina (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi);`,
        }),
        postcssPresetEnv({ stage: 0 }),
        postcssNested,
        calc, // Has to go after precss.
        postcssColorFunction,
        cssMqpacker,
    ],
}
