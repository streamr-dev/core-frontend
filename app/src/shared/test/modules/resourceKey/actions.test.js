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

    describe('getMyResourceKeys', () => {
        it('creates GET_MY_RESOURCE_KEYS_SUCCESS when fetching user api keys succeeded', async () => {
            const data = [{
                id: 'test',
                name: 'test',
            }]
            const keys = ['test']
            const serviceStub = sandbox.stub(services, 'getMyResourceKeys').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.GET_RESOURCE_KEYS_REQUEST,
            }, {
                type: 'updateEntities',
            }, {
                type: constants.GET_MY_RESOURCE_KEYS_SUCCESS,
                payload: {
                    keys,
                },
            }]

            const store = mockStore()
            await store.dispatch(actions.getMyResourceKeys())
            assert(serviceStub.calledOnce)

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates GET_RESOURCE_KEYS_FAILURE when fetching user api keys fails', async () => {
            const error = new Error('error')
            sandbox.stub(services, 'getMyResourceKeys').callsFake(() => Promise.reject(error))
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
                await store.dispatch(actions.getMyResourceKeys())
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
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

    describe('addMyResourceKey', () => {
        it('creates ADD_MY_RESOURCE_KEY_SUCCESS for succeeded key addition', async () => {
            const name = 'test'
            const key = '1'
            const data = {
                id: key,
                name,
            }

            const serviceStub = sandbox.stub(services, 'addMyResourceKey').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.ADD_RESOURCE_KEY_REQUEST,
            }, {
                type: 'updateEntities',
            },
            {
                type: constants.ADD_MY_RESOURCE_KEY_SUCCESS,
                payload: {
                    key,
                },
            }]

            const store = mockStore()
            await store.dispatch(actions.addMyResourceKey(name))
            assert(serviceStub.calledOnce)
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates ADD_RESOURCE_KEY_FAILURE for failed at key addition', async () => {
            const name = 'test'
            const error = new Error('error')
            sandbox.stub(services, 'addMyResourceKey').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.ADD_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.ADD_RESOURCE_KEY_FAILURE,
                payload: {
                    error: {
                        title: 'Error!',
                        message: 'error',
                    },
                },
            }]

            const store = mockStore()

            try {
                await store.dispatch(actions.addMyResourceKey(name))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('addStreamResourceKey', () => {
        it('creates ADD_STREAM_RESOURCE_KEY_SUCCESS for succeeded key addition', async () => {
            const streamId = '1234'
            const name = 'test'
            const key = '1'
            const data = {
                id: key,
                name,
            }

            const serviceStub = sandbox.stub(services, 'addStreamResourceKey').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.ADD_RESOURCE_KEY_REQUEST,
            }, {
                type: 'updateEntities',
            },
            {
                type: constants.ADD_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }, {
                type: constants.GET_RESOURCE_KEYS_REQUEST,
            }]

            const store = mockStore()
            await store.dispatch(actions.addStreamResourceKey(streamId, name))
            assert(serviceStub.calledOnce)
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates ADD_RESOURCE_KEY_FAILURE for failed at key addition', async () => {
            const streamId = '1234'
            const name = 'test'
            const error = new Error('error')
            sandbox.stub(services, 'addStreamResourceKey').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.ADD_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.ADD_RESOURCE_KEY_FAILURE,
                payload: {
                    error: {
                        title: 'Error!',
                        message: 'error',
                    },
                },
            }]

            const store = mockStore()

            try {
                await store.dispatch(actions.addStreamResourceKey(streamId, name))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('removeMyResourceKey', () => {
        it('creates REMOVE_MY_RESOURCE_KEY_SUCCESS for succeeded at key removal', async () => {
            const key = '1'

            const serviceStub = sandbox.stub(services, 'removeMyResourceKey').callsFake(() => Promise.resolve(null))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.REMOVE_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.REMOVE_MY_RESOURCE_KEY_SUCCESS,
                payload: {
                    key,
                },
            }]

            const store = mockStore()
            await store.dispatch(actions.removeMyResourceKey(key))
            assert(serviceStub.calledOnce)

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates REMOVE_MY_RESOURCE_KEY_FAILURE for failed key removal', async () => {
            const key = '1'
            const error = new Error('error')
            sandbox.stub(services, 'removeMyResourceKey').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.REMOVE_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.REMOVE_RESOURCE_KEY_FAILURE,
                payload: {
                    error: {
                        title: 'Error!',
                        message: 'error',
                    },
                },
            }]

            const store = mockStore()

            try {
                await store.dispatch(actions.removeMyResourceKey(key))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('removeStreamResourceKey', () => {
        it('creates REMOVE_STREAM_RESOURCE_KEY_SUCCESS for succeeded at key removal', async () => {
            const streamId = '1234'
            const key = '1'

            const serviceStub = sandbox.stub(services, 'removeStreamResourceKey').callsFake(() => Promise.resolve(null))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const expectedActions = [{
                type: constants.REMOVE_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
                payload: {
                    id: streamId,
                    key,
                },
            }]

            const store = mockStore()
            await store.dispatch(actions.removeStreamResourceKey(streamId, key))
            assert(serviceStub.calledOnce)

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates REMOVE_MY_RESOURCE_KEY_FAILURE for failed key removal', async () => {
            const streamId = '1234'
            const key = '1'
            const error = new Error('error')
            sandbox.stub(services, 'removeStreamResourceKey').callsFake(() => Promise.reject(error))

            const expectedActions = [{
                type: constants.REMOVE_RESOURCE_KEY_REQUEST,
            }, {
                type: constants.REMOVE_RESOURCE_KEY_FAILURE,
                payload: {
                    error: {
                        title: 'Error!',
                        message: 'error',
                    },
                },
            }]

            const store = mockStore()

            try {
                await store.dispatch(actions.removeStreamResourceKey(streamId, key))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
