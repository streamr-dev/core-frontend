// @flow

// StreamField ID used for the frontend UI only.
export type StreamField = {
    name: string,
    type: string,
    id?: string,
}

export type StreamFieldList = Array<StreamField>

export type StreamId = string

export type Stream = {
    id: StreamId,
    name: string,
    description: ?string,
    config: {
        fields?: StreamFieldList
    },
    feed?: {
        id: number,
        name: string,
        module: number,
    },
    lastUpdated: number,
    inactivityThresholdHours: number,
    partitions: number,
    autoConfigure: boolean,
    requireSignedData: boolean,
    storageDays: number,
    uiChannel: boolean,
    requireSignedData: boolean,
    requireEncryptedData: boolean,
    migrateToBrubeck: boolean,
    migrateSyncTurnedOnAt: ?string,
    migrateSyncLastRunAt: ?string,
}

export type StreamIdList = Array<StreamId>

export type StreamList = Array<Stream>

export type StreamEntities = {
    [StreamId]: Stream,
}
