// @flow

import type { StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type UserPageStreamsState = {
    ids: StreamIdList,
    fetching: boolean,
    updating: boolean,
    error?: ?ErrorInUi,
    savingStreamFields: boolean,
    pageSize: number,
    hasMoreSearchResults: ?boolean,
}
