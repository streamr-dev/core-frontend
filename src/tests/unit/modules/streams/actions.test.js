import assert from 'assert-diff'
import { normalize } from 'normalizr'
import sinon from 'sinon'

import * as actions from '../../../../modules/streams/actions'
import * as constants from '../../../../modules/streams/constants'
import * as services from '../../../../modules/streams/services'
import * as entityConstants from '../../../../modules/entities/constants'
import { streamsSchema } from '../../../../modules/entities/schema'
import mockStore from '../../../test-utils/mockStoreProvider'

describe('streams - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getStreams', () => {
        it('gets streams succesfully', async () => {
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

            const { result, entities } = normalize(streams, streamsSchema)

            sandbox.stub(services, 'getStreams').callsFake(() => Promise.resolve(streams))

            const store = mockStore()
            await store.dispatch(actions.getStreams())

            const expectedActions = [
                {
                    type: constants.GET_STREAMS_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_STREAMS_SUCCESS,
                    payload: {
                        streams: result,
                    },
                },
            ]

            assert.deepEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            sandbox.stub(services, 'getStreams').callsFake(() => Promise.reject(new Error('Error')))

            const store = mockStore()
            await store.dispatch(actions.getStreams())

            const expectedActions = [
                {
                    type: constants.GET_STREAMS_REQUEST,
                },
                {
                    type: constants.GET_STREAMS_FAILURE,
                    error: true,
                    payload: {},
                },
            ]
            assert.deepEqual(store.getActions(), expectedActions)
        })
    })
})
