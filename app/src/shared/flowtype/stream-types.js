// @flow

import type { Permission } from '$userpages/flowtype/permission-types'

// StreamField ID used for the frontend UI only.
export type StreamField = {
    name: string,
    type: string,
    id?: string,
}

export type StreamFieldList = Array<StreamField>

export type StreamId = string

export type NewStream = {
    name: string,
    description: ?string,
}

export type Stream = NewStream & {
    id: StreamId,
    config: {
        fields?: StreamFieldList
    },
    ownPermissions: Array<$ElementType<Permission, 'operation'>>,
    lastUpdated: number,
}

export type StreamIdList = Array<StreamId>

export type StreamList = Array<Stream>

export type StreamEntities = {
    [StreamId]: Stream,
}

export type CSVImporterSchema = {
    headers: Array<string>,
    timeZone: string,
    timestampColumnIndex: ?number
}
