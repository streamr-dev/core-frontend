// @flow

import type { Stream, CSVImporterSchema } from '../stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type StreamState = {
    byId: {
        [$ElementType<Stream, 'id'>]: Stream
    },
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

