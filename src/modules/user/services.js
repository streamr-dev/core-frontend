// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { User, IntegrationKey, ApiKey, UserProductPermissionList } from '../../flowtype/user-types'
import type { ProductId } from '../../flowtype/product-types'

export const getMyKeys = (): ApiResult<Array<ApiKey>> => get(formatApiUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatApiUrl('users', 'me'))

export const getUserProductPermissions = (id: ProductId): ApiResult<Array<UserProductPermissionList>> => (
    get(formatApiUrl('products', id, 'permissions', 'me'))
)
