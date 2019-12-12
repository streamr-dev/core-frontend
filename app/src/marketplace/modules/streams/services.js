// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { StreamId, StreamList } from '$shared/flowtype/stream-types'

export const getStreams = (): ApiResult<StreamList> => get({
    url: formatApiUrl('streams', {
        uiChannel: false,
        operation: 'SHARE',
    }),
})

export const getStreamData = (id: StreamId, fromTimestamp: number): ApiResult<Object> => get({
    url: formatApiUrl('streams', id, 'data', 'partitions', 0, 'from', {
        fromTimestamp,
    }),
})
