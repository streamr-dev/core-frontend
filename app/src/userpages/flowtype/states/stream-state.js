// @flow

import type { Stream, StreamId, StreamIdList, CSVImporterSchema } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '$userpages/flowtype/common-types'

export type CsvUploadState = {
    id: StreamId,
    fetching: boolean,
    fileUrl?: string,
    schema?: CSVImporterSchema,
}

export type UserPageStreamsState = {
    ids: StreamIdList,
    openStream: {
        id: ?StreamId,
    },
    fetching: boolean,
    error?: ?ErrorInUi,
    savingStreamFields: boolean,
    csvUpload: ?CsvUploadState,
    filter: ?Filter,
    editedStream: ?Stream,
    deleteDataError?: ?ErrorInUi,
}
