// @flow
const config = require('../../../config')

export default (...urlParts): string => urlParts
    .map(part => part.replace(/^\/|\/$/, ''))
    .unshift(config.apiUrl)
    .join('/')
