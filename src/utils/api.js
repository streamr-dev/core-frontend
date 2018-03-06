// @flow
import request from './request'
import type { ApiResult } from '../flowtype/common-types'

export const get = (endpoint: string, options?: Object): ApiResult => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    return request(endpoint, {
        ...defaultOptions,
        ...options
    })
}

export default get
