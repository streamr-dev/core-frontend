const webpack = require('webpack')
const dotenv = require('dotenv')
const dotenvSafe = require('dotenv-safe')

/**
 * Sets dotenv file variables into process.env (if not inProduction)
 * and returns a webpack plugin that sets then to the process.env in browser as well
 *
 * @param commonDotenvPath {string} path to common dotenv file, eg. .env.common
 * @param localDotenvPath {string} path to private dotenv file, eg. .env
 * @param isProduction {boolean}
 * @returns {webpack.EnvironmentPlugin}
 */

const getDotenvPlugin = (commonDotenvPath, localDotenvPath, isProduction) => {
    const localDotenv = !isProduction ? dotenv.config({
        example: null,
        path: localDotenvPath,
    }) : {}

    const commonDotenv = dotenvSafe.config({
        example: commonDotenvPath,
        path: !isProduction ? commonDotenvPath : null,
    })

    return new webpack.EnvironmentPlugin([
        ...Object.keys(commonDotenv.required || {}),
        ...Object.keys(localDotenv.parsed || {}),
    ])
}

module.exports = getDotenvPlugin
