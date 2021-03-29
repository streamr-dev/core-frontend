import { normalize } from 'normalizr'

import * as all from '$mp/modules/streams/selectors'
import { streamsSchema } from '$shared/modules/entities/schema'

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
        expect(all.selectStreamIds(state)).toStrictEqual(state.streams.ids)
    })

    it('selects streams', () => {
        expect(all.selectStreams(state)).toStrictEqual(streams)
    })

    it('selects fetching status for streams', () => {
        expect(all.selectFetchingStreams(state)).toStrictEqual(false)
    })

    it('selects error', () => {
        expect(all.selectStreamsError(state)).toStrictEqual(null)
    })
})
