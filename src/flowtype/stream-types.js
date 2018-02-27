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
