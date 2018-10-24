// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, IntegrationKey, ApiKey } from '../../flowtype/user-types'

export const getMyKeys = (): ApiResult<Array<ApiKey>> => get(formatApiUrl('users', 'me', 'keys', {
    noCache: Date.now(),
}))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatApiUrl('users', 'me', {
    noCache: Date.now(),
}))

