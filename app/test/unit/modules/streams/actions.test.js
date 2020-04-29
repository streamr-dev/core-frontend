import { normalize } from 'normalizr'
import sinon from 'sinon'

import * as actions from '$mp/modules/streams/actions'
import * as constants from '$mp/modules/streams/constants'
import * as services from '$mp/modules/streams/services'
import * as entityConstants from '$shared/modules/entities/constants'
import { streamsSchema } from '$shared/modules/entities/schema'
import mockStore from '$testUtils/mockStoreProvider'

describe('streams - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
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

            const getStreamsStub = sandbox.stub(services, 'getStreams').callsFake(() => Promise.resolve({
                streams,
                hasMoreResults: false,
            }))

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
                        hasMoreResults: false,
                    },
                },
            ]

            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(getStreamsStub.calledWith({})).toBe(true)
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
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })

    describe('clearStreamList', () => {
        it('clears the stream list', async () => {
            const store = mockStore()
            await store.dispatch(actions.clearStreamList())

            const expectedActions = [
                {
                    type: constants.CLEAR_STREAM_LIST,
                },
            ]
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })
})
