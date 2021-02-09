// @flow

import axios from 'axios'
import merge from 'lodash/merge'

import type { ApiResult, RequestMethod } from '$shared/flowtype/common-types'
import RequestError from '$shared/errors/RequestError'
import getAuthorizationHeader from './getAuthorizationHeader'

export const getData = ({ data }: {
    data: any
}): any => data

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
            throw new RequestError(res)
        })
}
