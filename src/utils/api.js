// @flow
import request from './request'
import type { ApiResult } from '../flowtype/common-types'
import { formatUrl } from './url'

export const get = (endpoint: string, options?: Object): ApiResult => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    return request(formatUrl(endpoint), {
        ...defaultOptions,
        ...options
    })
}

export default get
