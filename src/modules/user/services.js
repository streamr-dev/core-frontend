// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'

export const getMyKeys = (): ApiResult => get(formatUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult => get(formatUrl('integration_keys'))
