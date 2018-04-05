// @flow

import request from './request'
import type { ApiResult } from '../flowtype/common-types'

export const get = (endpoint: string, options?: Object): ApiResult => request(endpoint, 'get', null, options)

export const post = (endpoint: string, data: any, options?: Object): ApiResult => request(endpoint, 'post', data, options)

export const put = (endpoint: string, data: any, options?: Object): ApiResult => request(endpoint, 'put', data, options)
