// @flow

import axios from 'axios'
import merge from 'lodash/merge'

import type { ErrorInUi, ApiResult, RequestMethod } from '../flowtype/common-types'

export const getData = ({ data }: {
    data: any
}): any => data

export const getError = (res: any): ErrorInUi => ({
    message: (res && res.response && res.response.data && res.response.data.message) || (res && res.message) || 'Something went wrong',
    code: (res && res.response && res.response.data && res.response.data.code) || null,
    statusCode: res && res.response && res.response.status,
})

export default function request(url: string, method: RequestMethod = 'get', data?: any = null, options?: Object): ApiResult<*> {
    const defaultOptions = {
        headers: {},
    }

    if (data !== null) {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            'Content-Type': 'application/json',
        }
    }

    // Merge options with defaults
    const requestOptions = merge(defaultOptions, options)

    return axios.request({
        ...requestOptions,
        url,
        method,
        data,
        withCredentials: true,
    })
        .then((res) => (
            getData(res)
        ))
        .catch((res: any) => {
            throw getError(res)
        })
}
