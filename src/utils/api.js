// @flow
import request from './request'
import type { ApiResult } from '../flowtype/common-types'

const path = require('path')

export const createApiUrl = (...urlParts: Array<string>): string => {
    const rootUrl: string = process.env.API_URL || ''
    const resource = path.join.apply(null, urlParts)

    return `${rootUrl}/${resource}`
}

export const get = (endpoint: string, options?: Object): ApiResult => {
    const fullUrl :string = createApiUrl(endpoint)

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

export default get
