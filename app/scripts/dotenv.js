const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const dotenvSafe = require('dotenv-safe')
const isProduction = require('./isProduction')

const LOCAL_DOTENV_PATH = path.resolve(__dirname, '../.env')
const REQUIRED_DOTENV_PATH = path.resolve(__dirname, '../.env.required')
const TEMPLATE_DOTENV_PATH = path.resolve(__dirname, '../.env.template')

/**
 * Loads .env into process.env in non-production environment.
 * @returns An object of environment variable key-value pairs
 */
const loadLocalDotenv = () =>
    !isProduction()
        ? dotenv.config({
            path: LOCAL_DOTENV_PATH,
        }).parsed
        : {}

/**
 * Loads .env.required into process.env in non-production environment.
 * @returns An object of environment variable key-value pairs
 */
const loadRequiredDotenv = () =>
    dotenvSafe.config({
        example: REQUIRED_DOTENV_PATH,
        path: !isProduction() ? REQUIRED_DOTENV_PATH : '',
    }).required

/**
 * Loads .env.template (optional env vars) keys and overrides the values with nulls
 * @returns An object of environment variable key-value pairs where all the values are null
 */
const loadTemplateDotenv = () => {
    const file = fs.readFileSync(TEMPLATE_DOTENV_PATH)
    // Use dotenv.parse so that the values will not be set to process.env
    const vars = dotenv.parse(file)
    return Object.keys(vars || {}).reduce(
        (acc, val) => ({
            ...acc,
            [val]: null,
        }),
        {},
    )
}

/**
 * Loads .env.common and .env into process.env in non-production environment.
 * @returns An object of the env variables.
 */
const loadDotenv = () => {
    // Here the order must be local, required, template
    const localDotEnv = loadLocalDotenv()
    const requiredDotenv = loadRequiredDotenv()
    const templateDotEnv = loadTemplateDotenv()

    // Here the order must be template, required, local
    return {
        ...templateDotEnv,
        ...requiredDotenv,
        ...localDotEnv,
    }
}

module.exports = loadDotenv
