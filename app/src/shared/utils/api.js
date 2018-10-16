// @flow

import type { ApiResult } from '$shared/flowtype/common-types'
import request from '$shared/utils/request'

export const get = (endpoint: string, options?: Object): ApiResult<*> => request(endpoint, 'get', null, options)

export const post = (endpoint: string, data: any, options?: Object): ApiResult<*> => request(endpoint, 'post', data, options)

export const put = (endpoint: string, data: any, options?: Object): ApiResult<*> => request(endpoint, 'put', data, options)

export const del = (endpoint: string, data: any, options?: Object): ApiResult<*> => request(endpoint, 'delete', data, options)
