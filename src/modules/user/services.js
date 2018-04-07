// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'

export const getMyKeys = (): ApiResult => get(formatUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult => get(formatUrl('integration_keys'))

export const getUserData = (): ApiResult => get(formatUrl('users', 'me'))

// TODO: These won't be needed in the production version, this just sets the login status in the mock api
export const login = (): ApiResult => get(formatUrl('users', 'login'))
export const logout = (): ApiResult => get(formatUrl('users', 'logout'))
