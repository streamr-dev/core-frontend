// @flow

import type { StreamId, StreamIdList, CSVImporterSchema } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '$userpages/flowtype/common-types'

export type UserPageStreamsState = {
    ids: StreamIdList,
    openStream: {
        id: ?StreamId,
    },
    fetching: boolean,
    error?: ?ErrorInUi,
    savingStreamFields: boolean,
    csvUpload: ?{
        id: StreamId,
        fetching: boolean,
        fileUrl?: string,
        schema?: CSVImporterSchema
    },
    filter: ?Filter,
}
