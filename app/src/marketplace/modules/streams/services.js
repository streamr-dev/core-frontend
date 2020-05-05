// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { StreamId, StreamList } from '$shared/flowtype/stream-types'

export const getStreams = (params: any): ApiResult<{
    streams: StreamList,
    hasMoreResults: boolean,
}> => {
    const nextParams = {
        uiChannel: false,
        operation: 'SHARE',
        ...(params || {}),
    }

    if (nextParams.max) {
        // query 1 extra element to determine if we should show "load more" button
        nextParams.max += 1
    }

    return get({
        url: formatApiUrl('streams', {
            ...nextParams,
        }),
    })
        .then((streams) => ({
            streams: nextParams.max ? streams.splice(0, nextParams.max - 1) : streams,
            hasMoreResults: !!nextParams.max && streams.length > 0,
        }))
}

export const getStreamData = (id: StreamId, fromTimestamp: number): ApiResult<Object> => get({
    url: formatApiUrl('streams', id, 'data', 'partitions', 0, 'from', {
        fromTimestamp,
    }),
})
