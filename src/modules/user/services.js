// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { User, IntegrationKey, LoginKey, UserProductPermissionList } from '../../flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'

export const getMyKeys = (): ApiResult<Array<LoginKey>> => get(formatUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatUrl('users', 'me'))

export const getUserProductPermissions = (id: ProductId): ApiResult<Array<UserProductPermissionList>> => (
    get(formatUrl('products', id, 'permissions', 'me'))
)
