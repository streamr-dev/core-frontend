// @flow
const config = require('../../../config')
const path = require('path')

export default (...urlParts: Array<string>): string => path.join.apply(null, [config.apiUrl, ...urlParts])
