// @flow

const isProduction = require('.').isProduction

module.exports = () => {
    if (!isProduction) {
        const dotenv = require('dotenv')
        const fs = require('fs')

        try {
            const envCommon = dotenv.parse(fs.readFileSync('.env.common'))
            const envLocal = dotenv.parse(fs.readFileSync('.env'))
            const parsed = Object.assign({}, envCommon, envLocal)

            Object.keys(parsed).forEach(key => {
                if (!process.env.hasOwnProperty(key)) {
                    process.env[key] = parsed[key]
                }
            })

            return {
                parsed,
            }
        } catch (error) {
            return {
                error,
            }
        }
    }
}
