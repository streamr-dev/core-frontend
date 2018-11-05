// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, IntegrationKey, ApiKey, UserProductPermissionList } from '../../flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'
import { getValidId } from '../../utils/product'
import routes from '$routes'

export const getMyKeys = (): ApiResult<Array<ApiKey>> => get(formatApiUrl('users', 'me', 'keys', {
    noCache: Date.now(),
}))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatApiUrl('users', 'me', {
    noCache: Date.now(),
}))

/*
    Prefixed with 'async' so that if getValidId() throws, it can be caught with getUserProductPermissions(id).catch().
    Otherwise it'd be a synchronous error.
  */
export const getUserProductPermissions = async (id: ProductId): ApiResult<Array<UserProductPermissionList>> => (
    get(formatApiUrl('products', getValidId(id, false), 'permissions', 'me'))
)

/**
 * Sends a logout request.
 */
export const logout = (): Promise<any> => get(routes.externalLogout())
