import assert from 'assert-diff'
import { normalize } from 'normalizr'

import * as all from '../../../../modules/streams/selectors'
import { streamsSchema } from '../../../../modules/entities/schema'

const streams = [
    {
        id: 'run-canvas-spec',
        partitions: 1,
        name: 'run-canvas-spec',
        feed: {
            id: 7,
            name: 'API',
            module: 147,
        },
        config: {
            fields: [
                {
                    name: 'numero',
                    type: 'number',
                },
                {
                    name: 'areWeDoneYet',
                    type: 'boolean',
                },
            ],
        },
        description: 'Stream for integration test RunCanvasSpec',
        uiChannel: false,
        dateCreated: '2017-11-10T16:43:01Z',
        lastUpdated: '2017-11-10T16:43:01Z',
    },
]

const normalized = normalize(streams, streamsSchema)

const state = {
    test: true,
    streams: {
        ids: normalized.result,
        fetching: false,
        error: null,
    },
    otherData: 42,
    entities: normalized.entities,
}

describe('streams - selectors', () => {
    it('selects stream ids', () => {
        assert.deepEqual(all.selectStreamIds(state), state.streams.ids)
    })

    it('selects streams', () => {
        assert.deepEqual(all.selectStreams(state), streams)
    })

    it('selects fetching status for streams', () => {
        assert.deepEqual(all.selectFetchingStreams(state), false)
    })

    it('selects error', () => {
        assert.deepEqual(all.selectStreamsError(state), null)
    })
})
