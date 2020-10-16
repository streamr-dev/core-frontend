// @flow

import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import routes from '$routes'

export const getStreamResourceKeys = (streamId: StreamId): ApiResult<ResourceKeyList> => get({
    url: routes.api.streams.keys.index({
        streamId,
    }),
})
