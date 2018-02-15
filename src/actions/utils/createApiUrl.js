// @flow
const config = require('../../../config')

export default (...urlParts: Array<string>): string => [config.apiUrl, ...urlParts]
    .map(part => part.replace(/^\/|\/$/, ''))
    .join('/')
