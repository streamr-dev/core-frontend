const dotenv = require('dotenv')
const dotenvSafe = require('dotenv-safe')
const path = require('path')
const isProduction = require('./isProduction')

/**
 * Loads .env.common into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadCommonDotenv = () => {
    const envPath = path.resolve(__dirname, '../.env.common')
    const vars = dotenvSafe.config({
        example: envPath,
        path: !isProduction() ? envPath : null,
    }).required

    return Object.keys(vars || {})
}

/**
 * Loads .env into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadLocalDotenv = () => {
    const envPath = path.resolve(__dirname, '../.env')
    const vars = !isProduction() ? dotenv.config({
        example: null,
        path: envPath,
    }).parsed : {}

    return Object.keys(vars || {})
}

/**
 * Loads .env.common and .env into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadDotenv = () => ([
    ...loadCommonDotenv(),
    ...loadLocalDotenv(),
])

module.exports = loadDotenv
