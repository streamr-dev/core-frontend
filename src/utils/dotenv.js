const isProduction = require('./isProduction')

const parse = (filename) => {
    const fs = require('fs')
    const dotenv = require('dotenv')

    if (fs.existsSync(filename)) {
        return dotenv.parse(fs.readFileSync(filename))
    } else {
        return {}
    }
}

module.exports = () => {
    if (!isProduction()) {
        const parsed = {
            ...parse('.env.common'),
            ...parse('.env'),
        }

        Object.keys(parsed).forEach(key => {
            if (!process.env.hasOwnProperty(key)) {
                process.env[key] = parsed[key]
            }
        })
    }
}
