const isProduction = require('./isProduction')

const parse = (filename) => {
    const fs = require('fs')
    const dotenv = require('dotenv')

    try {
        return dotenv.parse(fs.readFileSync(filename))
    } catch (e) {
        return {}
    }
}

module.exports = () => {
    if (!isProduction) {
        const parsed = Object.assign({}, parse('.env.common'), parse('.env'))

        Object.keys(parsed).forEach(key => {
            if (!process.env.hasOwnProperty(key)) {
                process.env[key] = parsed[key]
            }
        })
    }
}
