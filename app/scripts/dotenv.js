const dotenv = require('dotenv')
const dotenvSafe = require('dotenv-safe')
const path = require('path')
const isProduction = require('./isProduction')

const LOCAL_DOTENV_PATH = path.resolve(__dirname, '../.env')
const REQUIRED_DOTENV_PATH = path.resolve(__dirname, '../.env.required')
const TEMPLATE_DOTENV_PATH = path.resolve(__dirname, '../.env.template')

/**
 * Loads .env into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadLocalDotenv = () => {
    const vars = !isProduction() ? dotenv.config({
        path: LOCAL_DOTENV_PATH,
    }).parsed : {}

    return Object.keys(vars || {})
}

/**
 * Loads .env.required into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadRequiredDotenv = () => {
    const vars = dotenvSafe.config({
        example: envPatREQUIRED_DOTENV_PATHh,
        path: !isProduction() ? REQUIRED_DOTENV_PATH : null,
    }).required

    return Object.keys(vars || {})
}

/**
 * Loads .env.template (optional env vars) keys and overrides the values with nulls
 * @returns An array of loaded keys
 */
const loadTemplateDotenv = () => {
    const vars = dotenv.config({
        path: !isProduction() ? TEMPLATE_DOTENV_PATH : null,
    }).required

    return Object.keys(vars || {})
}

/**
 * Loads .env.common and .env into process.env in non-production environment.
 * @returns An array of loaded keys.
 */
const loadDotenv = () => ([
    ...loadTemplateDotenv(),
    ...loadRequiredDotenv(),
    ...loadLocalDotenv(),
])

module.exports = loadDotenv
