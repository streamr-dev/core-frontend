// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { IntegrationKey } from '$shared/flowtype/user-types'

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))
