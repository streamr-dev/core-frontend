// @flow

import type { Stream, StreamIdList, CSVImporterSchema } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type UserPageStreamsState = {
    ids: StreamIdList,
    openStream: {
        id: ?$ElementType<Stream, 'id'>
    },
    fetching: boolean,
    error?: ?ErrorInUi,
    savingStreamFields: boolean,
    csvUpload: ?{
        id: $ElementType<Stream, 'id'>,
        fetching: boolean,
        fileUrl?: string,
        schema?: CSVImporterSchema
    }
}
