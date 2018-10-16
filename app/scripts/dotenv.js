const path = require('path')
const dotenvSafe = require('dotenv-safe')
const isProduction = require('./isProduction')

/**
 * Loads .env.common into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadCommonDotenv = () => {
    const examplePath = path.resolve(__dirname, '../.env.common')
    const envPath = path.resolve(__dirname, '../.env')
    const vars = dotenvSafe.config({
        example: examplePath,
        path: !isProduction() ? envPath : null,
        allowEmptyValues: true,
    }).required

    return Object.keys(vars || {})
}

/**
 * Loads .env.common and .env into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadDotenv = () => ([
    ...loadCommonDotenv(),
])

module.exports = loadDotenv
