import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$shared/modules/integrationKey/actions'
import * as constants from '$shared/modules/integrationKey/constants'
import * as services from '$shared/modules/integrationKey/services'
import * as entitiesActions from '$shared/modules/entities/actions'
import { integrationKeyServices } from '$shared/utils/constants'

describe('integrationKey - actions', () => {
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

    describe('createIntegrationKey', () => {
        it('creates CREATE_INTEGRATION_KEY_SUCCESS when creating private key has succeeded', async () => {
            const privateKey = '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10'
            const data = {
                id: 'testid',
                user: 1234,
                name: 'Test',
                service: integrationKeyServices.PRIVATE_KEY,
                json: {
                    address: privateKey,
                },
            }
            const serviceStub = sandbox.stub(services, 'createPrivateKey').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const store = mockStore()
            await store.dispatch(actions.createIntegrationKey('name', privateKey))
            assert(serviceStub.calledOnce)

            const expectedActions = [{
                type: constants.CREATE_INTEGRATION_KEY_REQUEST,
            },
            {
                type: 'updateEntities',
            },
            {
                type: constants.CREATE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id: data.id,
                },
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates CREATE_INTEGRATION_KEY_FAILURE when creating private key fails', async () => {
            const privateKey = '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10'
            const error = new Error('error')
            sandbox.stub(services, 'createPrivateKey').callsFake(() => Promise.reject(error))
            const expectedActions = [{
                type: constants.CREATE_INTEGRATION_KEY_REQUEST,
            },
            {
                type: constants.CREATE_INTEGRATION_KEY_FAILURE,
                payload: {
                    error: {
                        message: 'error',
                    },
                },
            }]
            const store = mockStore()

            try {
                await store.dispatch(actions.createIntegrationKey('name', privateKey))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('deleteIntegrationKey', () => {
        it('throws an error if id is not defined', () => {
            try {
                actions.deleteIntegrationKey()
            } catch (e) {
                assert(e.message.match(/No id/i))
            }
        })

        it('creates DELETE_INTEGRATION_KEY_SUCCESS when deleting an integration key has succeeded', async () => {
            const id = 'testid'
            const serviceStub = sandbox.stub(services, 'deleteIntegrationKey').callsFake(() => Promise.resolve(null))

            const store = mockStore()
            await store.dispatch(actions.deleteIntegrationKey(id))
            assert(serviceStub.calledOnce)

            const expectedActions = [{
                type: constants.DELETE_INTEGRATION_KEY_REQUEST,
            },
            {
                type: constants.DELETE_INTEGRATION_KEY_SUCCESS,
                payload: {
                    id,
                },
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates DELETE_INTEGRATION_KEY_FAILURE deleting an integration key fails', async () => {
            const error = new Error('error')
            sandbox.stub(services, 'deleteIntegrationKey').callsFake(() => Promise.reject(error))
            const expectedActions = [{
                type: constants.DELETE_INTEGRATION_KEY_REQUEST,
            },
            {
                type: constants.DELETE_INTEGRATION_KEY_FAILURE,
                payload: {
                    error: {
                        message: 'error',
                    },
                },
            }]
            const store = mockStore()

            try {
                await store.dispatch(actions.deleteIntegrationKey('name'))
            } catch (e) {
                assert(e === error)
            }

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('createIdentity', () => {
        it('creates CREATE_IDENTITY_SUCCESS when creating identity has succeeded', async () => {
            const data = {
                id: 'testid',
                user: 1234,
                name: 'Test',
                service: integrationKeyServices.ETHEREREUM_IDENTITY,
                json: {
                    address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                },
            }
            const serviceStub = sandbox.stub(services, 'createIdentity').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const store = mockStore()
            const params = {
                name: 'name',
                address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                signChallenge: () => Promise.resolve('signature'),
            }
            await store.dispatch(actions.createIdentity(params))
            assert(serviceStub.calledOnce)
            assert(serviceStub.calledWith(params))

            const expectedActions = [{
                type: constants.CREATE_IDENTITY_REQUEST,
            },
            {
                type: 'updateEntities',
            },
            {
                type: constants.CREATE_IDENTITY_SUCCESS,
                payload: {
                    id: data.id,
                },
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('creates CREATE_IDENTITY_FAILURE creating identity fails', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'createIdentity').callsFake(() => Promise.reject(error))
            const expectedActions = [{
                type: constants.CREATE_IDENTITY_REQUEST,
            },
            {
                type: constants.CREATE_IDENTITY_FAILURE,
                payload: {
                    error: {
                        message: 'error',
                        code: undefined,
                    },
                },
            }]
            const store = mockStore()
            const params = {
                name: 'name',
                address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                signChallenge: () => Promise.resolve('signature'),
            }

            try {
                await store.dispatch(actions.createIdentity(params))
            } catch (e) {
                assert(e === error)
            }

            assert(serviceStub.calledWith(params))
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('fetchIntegrationKeys', () => {
        it('calls services.fetchIntegrationKeys and updates integration keys', async () => {
            const data = [
                {
                    id: 'testid',
                    user: 1234,
                    name: 'Marketplace test',
                    service: integrationKeyServices.ETHEREREUM_IDENTITY,
                    json: {
                        address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    },
                },
                {
                    id: 'anotherid',
                    user: 4321,
                    name: 'A private key',
                    service: integrationKeyServices.PRIVATE_KEY,
                    json: {
                        address: '0x829BD824B016326A401d083B33D092293333A830',
                    },
                },
            ]

            const serviceStub = sandbox.stub(services, 'getIntegrationKeys').callsFake(() => Promise.resolve(data))
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const store = mockStore()
            await store.dispatch(actions.fetchIntegrationKeys())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.INTEGRATION_KEYS_REQUEST,
                },
                {
                    type: 'updateEntities',
                },
                {
                    type: constants.INTEGRATION_KEYS_SUCCESS,
                    payload: {
                        ethereumIdentities: ['testid'],
                        privateKeys: ['anotherid'],
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getIntegrationKeys and handles error', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'getIntegrationKeys').callsFake(() => Promise.reject(error))

            const store = mockStore()

            try {
                await store.dispatch(actions.fetchIntegrationKeys())
            } catch (e) {
                assert(e === error)
            }
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.INTEGRATION_KEYS_REQUEST,
                },
                {
                    type: constants.INTEGRATION_KEYS_FAILURE,
                    payload: {
                        error: {
                            message: 'error',
                        },
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
