// @flow

import axios from 'axios'
import merge from 'lodash/merge'

import type { ErrorFromApi, ErrorInUi, ApiResult, RequestMethod } from '../flowtype/common-types'

export const getData = ({data}: {
    data: any
}): any => data

export const getError = ({data, status, message}: {
    data: ?ErrorFromApi,
    status: ?number,
    message: ?string
}): ErrorInUi => ({
    message: (data && data.message) || message || 'Something went wrong',
    code: data && data.code || null,
    statusCode: status
})

export default function request(url: string, method: RequestMethod = 'get', data?: any = null, options?: Object): ApiResult {
    // Merge options with defaults
    const requestOptions = merge({
        headers: {
            'Content-Type': 'application/json',
        },
    }, options)

    return axios.request({
        ...requestOptions,
        url,
        method,
        data,
    })
        .then((res) => getData(res))
        .catch((res: any) => {
            throw getError(res)
        })
}

