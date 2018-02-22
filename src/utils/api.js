// @flow
import request from './request'
const config = require('../../config')

export const createApiUrl = (...urlParts: Array<string>): string => [config.apiUrl, ...urlParts]
    .map(part => part.replace(/^\/|\/$/, ''))
    .join('/')

export const callApi = (endpoint: string, options?: Object) => {
    const fullUrl = createApiUrl(endpoint)
  
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }
  
    return request(fullUrl, {
        ...defaultOptions,
        ...options
    })
}

export default callApi