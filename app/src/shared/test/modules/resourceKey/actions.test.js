import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$shared/modules/resourceKey/actions'
import * as constants from '$shared/modules/resourceKey/constants'
import * as services from '$shared/modules/resourceKey/services'
import * as entitiesActions from '$shared/modules/entities/actions'

describe('resourceKey - actions', () => {
    let sandbox
    let oldStreamrApiUrl

    beforeEach(() => {
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('getStreamResourceKeys', () => {
        it('creates GET_STREAM_RESOURCE_KEYS_SUCCESS when fetching stream api keys succeeded', async () => {
            const streamId = '1234'
            const data = [{
                id: 'test',
                name: 'test',
            }]
            const keys = ['test']
            const serviceStub = sandbox.stub(services, 'getStreamResourceKeys').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.GET_RESOURCE_KEYS_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: constants.GET_STREAM_RESOURCE_KEYS_SUCCESS,
                payload: {
                    id: streamId,
                    keys,
                },
            }]

            const store = mockStore()
            await store.dispatch(actions.getStreamResourceKeys(streamId))
            assert(serviceStub.calledOnce)

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates GET_RESOURCE_KEYS_FAILURE when fetching stream api keys fails', async () => {
            const streamId = '1234'
            const error = new Error('error')
            sandbox.stub(services, 'getStreamResourceKeys').callsFake(() => Promise.reject(error))
            const expectedActions = [{
                type: constants.GET_RESOURCE_KEYS_REQUEST,
            },
            {
                type: constants.GET_RESOURCE_KEYS_FAILURE,
                payload: {
                    error: {
                        title: 'Error!',
                        message: 'error',
                    },
                },
            }]
            const store = mockStore()

            try {
                await store.dispatch(actions.getStreamResourceKeys(streamId))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
