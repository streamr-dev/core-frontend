// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { User, IntegrationKey, ApiKey, UserProductPermissionList } from '../../flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'

export const getMyKeys = (): ApiResult<Array<ApiKey>> => get(formatUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatUrl('users', 'me'))

// TODO: These won't be needed in the production version, this just sets the login status in the mock api
export const login = (): ApiResult<void> => get(formatUrl('users', 'login'))
export const logout = (): ApiResult<void> => get(formatUrl('users', 'logout'))

export const getUserProductPermissions = (id: ProductId): ApiResult<Array<UserProductPermissionList>> =>
    get(formatUrl('products', id, 'permissions', 'me'))
