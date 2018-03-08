// @flow

export type StreamField = {
    name: string,
    type: string
}

export type Stream = {
    id: string,
    name: string,
    description: ?string,
    config: {
        fields?: Array<StreamField>
    }
}

export type StreamId = $ElementType<Stream, 'id'>

export type StreamIdList = Array<StreamId>

export type StreamList = Array<Stream>

export type StreamEntities = {
    [StreamId]: Stream,
}
