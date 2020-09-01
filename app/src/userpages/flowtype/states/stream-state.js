// @flow

import type { Stream, StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type UserPageStreamsState = {
    ids: StreamIdList,
    openStream: {
        id: ?StreamId,
    },
    fetching: boolean,
    updating: boolean,
    error?: ?ErrorInUi,
    savingStreamFields: boolean,
    editedStream: ?Stream,
    autodetectFetching: boolean,
    pageSize: number,
    hasMoreSearchResults: ?boolean,
}
