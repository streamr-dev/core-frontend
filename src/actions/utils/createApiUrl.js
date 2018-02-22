// @flow

const path = require('path')

export default (...urlParts: Array<string>): string => path.join.apply(null, [process.env.API_URL || '', ...urlParts])
