// @flow

import axios from 'axios'
import merge from 'lodash/merge'

import type { ErrorFromApi, ErrorInUi, ApiResult, RequestMethod } from '../flowtype/common-types'
import { localstorageUserIdKey } from './constants'

export const getData = ({ data }: {
    data: any
}): any => data

export const getError = ({ data, status, message }: {
    data: ?ErrorFromApi,
    status: ?number,
    message: ?string
}): ErrorInUi => ({
    message: (data && data.message) || message || 'Something went wrong',
    code: (data && data.code) || null,
    statusCode: status,
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

    // Get login key from localstorage
    const id: ?string = localStorage.getItem(localstorageUserIdKey)

    if (id !== null && typeof id === 'string') {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            Authorization: `Token ${id}`,
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
