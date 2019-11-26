// @flow

import type { Stream, StreamId, StreamIdList, CSVImporterSchema } from '$shared/flowtype/stream-types'
import type { Operation } from '$userpages/flowtype/permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

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
    editedStream: ?Stream,
    deleteDataError?: ?ErrorInUi,
    autodetectFetching: boolean,
    permissions: ?Array<Operation>,
    pageSize: number,
    hasMoreSearchResults: ?boolean,
}
