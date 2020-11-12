import uuid from 'uuid'

import * as actions from '$userpages/modules/userPageStreams/actions'
import * as selectors from '$userpages/modules/userPageStreams/selectors'
import { initStore } from '$shared/../store'

import { streamSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'

describe('updateEditStream', () => {
    let store

    beforeEach(() => {
        store = initStore()
    })

    it('can add/remove fields', () => {
        const id = uuid()
        handleEntities(streamSchema, store.dispatch)({
            id,
            name: '',
            description: '',
            config: {},
            lastUpdated: 0,
            autoConfigure: false,
            partitions: 1,
            inactivityThresholdHours: 0,
            requireSignedData: false,
            requireEncryptedData: false,
            storageDays: 365,
            uiChannel: false,
        })
        store.dispatch(actions.openStream(id))

        let editedStream = selectors.selectOpenStream(store.getState())
        expect(editedStream).toBeTruthy()

        // hack stream id into userPageStreams state
        store.dispatch({
            type: actions.GET_STREAMS_SUCCESS,
            streams: [editedStream.id],
        })

        const field1 = {
            name: 'field1',
            type: selectors.fieldTypes[0],
            id: uuid(),
        }
        const field2 = {
            name: 'field2',
            type: selectors.fieldTypes[1],
            id: uuid(),
        }

        store.dispatch(actions.updateEditStream({
            ...editedStream,
            config: {
                ...editedStream.config,
                fields: [field1, field2],
            },
        }))

        editedStream = selectors.selectOpenStream(store.getState())
        expect(editedStream.config.fields).toEqual([field1, field2])

        // update the stored stream
        handleEntities(streamSchema, store.dispatch)(editedStream)
        let streams = selectors.selectStreams(store.getState())

        // ensure stored stream fields match
        expect(streams[0].config.fields).toEqual([field1, field2])

        // remove field 2
        // if the updater tries to merge the array elements rather than
        // replace them, then this will lead to both field1 & field2
        // still in the config, when only field1 should be
        store.dispatch(actions.updateEditStream({
            ...editedStream,
            config: {
                ...editedStream.config,
                fields: [field1],
            },
        }))

        editedStream = selectors.selectOpenStream(store.getState())

        expect(editedStream.config.fields).toEqual([field1])

        handleEntities(streamSchema, store.dispatch)(editedStream)
        streams = selectors.selectStreams(store.getState())
        // ensure stored stream fields match
        expect(streams[0].config.fields).toEqual([field1])
    })
})
