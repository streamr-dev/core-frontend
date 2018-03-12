// @flow

export type StreamField = {
    name: string,
    type: string
}

export type StreamId = string

export type Stream = {
    id: StreamId,
    name: string,
    description: ?string,
    config: {
        fields?: Array<StreamField>
    }
}

export type StreamIdList = Array<StreamId>

export type StreamList = Array<Stream>

export type StreamEntities = {
    [StreamId]: Stream,
}
