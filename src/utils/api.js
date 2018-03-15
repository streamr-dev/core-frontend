// @flow
import request from './request'
import type { ApiResult } from '../flowtype/common-types'

export const get = (endpoint: string, options?: Object): ApiResult => {
    return request(endpoint, 'get', options)
}

export const post = (endpoint: string, data: any, options?: Object): ApiResult => {
    return request(endpoint, 'post', {
        ...options,
        data,
    })
}
