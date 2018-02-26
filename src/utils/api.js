// @flow
import request from './request'

const path = require('path')

export const createApiUrl = (...urlParts: Array<string>): string => path.join.apply(null, [process.env.API_URL || '', ...urlParts])

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