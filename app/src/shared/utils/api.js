// @flow

import type { ApiResult } from '$shared/flowtype/common-types'
import request, { type RequestParams } from '$shared/utils/request'

export const get = (args: RequestParams): ApiResult<*> => request({
    ...args,
    method: 'get',
})

export const post = (args: RequestParams): ApiResult<*> => request({
    ...args,
    method: 'post',
})

export const put = (args: RequestParams): ApiResult<*> => request({
    ...args,
    method: 'put',
})

export const del = (args: RequestParams): ApiResult<*> => request({
    ...args,
    method: 'delete',
})
