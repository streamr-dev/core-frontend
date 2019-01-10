// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export const getMyResourceKeys = (): ApiResult<ResourceKeyList> => get(formatApiUrl('users', 'me', 'keys'))

export const getStreamResourceKeys = (id: StreamId): ApiResult<ResourceKeyList> => get(formatApiUrl('streams', id, 'keys'))
