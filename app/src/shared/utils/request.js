// @flow

import axios from 'axios'
import merge from 'lodash/merge'
import get from 'lodash/get'

import getAuthorizationHeader from './getAuthorizationHeader'
import type { ErrorInUi, ApiResult, RequestMethod } from '$shared/flowtype/common-types'

export const getData = ({ data }: {
    data: any
}): any => data

export const getError = (res: any): ErrorInUi => ({
    message: get(res, 'response.data.error') || get(res, 'response.data.message') || (res && res.message) || 'Something went wrong',
    code: get(res, 'response.data.code') || null,
    statusCode: res && res.response && res.response.status,
})

export type RequestParams = {
    url: string,
    method?: RequestMethod,
    data?: any,
    options?: Object,
    useAuthorization?: boolean,
}

export default function request({
    url,
    options,
    method = 'get',
    data = null,
    useAuthorization = true,
}: RequestParams): ApiResult<*> {
    const defaultOptions = {
        headers: {
            ...(useAuthorization ? getAuthorizationHeader() : {}),
        },
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
    })
        .then((res) => (
            getData(res)
        ))
        .catch((res: any) => {
            throw getError(res)
        })
}
