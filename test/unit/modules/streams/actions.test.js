import assert from 'assert-diff'
import { normalize } from 'normalizr'
import sinon from 'sinon'

import * as actions from '../../../../src/modules/streams/actions'
import * as constants from '../../../../src/modules/streams/constants'
import * as services from '../../../../src/modules/streams/services'
import * as entityConstants from '../../../../src/modules/entities/constants'
import { streamsSchema } from '../../../../src/modules/entities/schema'
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

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const error = new Error('Error')
            sandbox.stub(services, 'getStreams').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getStreams())

            const expectedActions = [
                {
                    type: constants.GET_STREAMS_REQUEST,
                },
                {
                    type: constants.GET_STREAMS_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
