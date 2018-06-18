import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'

import * as actions from '../../../../src/modules/user/actions'
import * as constants from '../../../../src/modules/user/constants'
import * as services from '../../../../src/modules/user/services'

describe('user - actions', () => {
    let sandbox
    let oldMarketplaceApiUrl
    let oldStreamrApiUrl

    beforeEach(() => {
        oldMarketplaceApiUrl = process.env.MARKETPLACE_API_URL
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.MARKETPLACE_API_URL = ''
        process.env.STREAMR_API_URL = ''
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
        process.env.MARKETPLACE_API_URL = oldMarketplaceApiUrl
        process.env.STREAMR_API_URL = oldStreamrApiUrl
    })

    describe('fetchLinkedWeb3Accounts', () => {
        it('calls services.getIntegrationKeys and updates linked web3 accounts', async () => {
            const data = [
                {
                    id: 'testid',
                    user: 1234,
                    name: 'Marketplace test',
                    service: 'ETHEREUM_ID',
                    json: {
                        address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    },
                },
            ]

            const serviceStub = sandbox.stub(services, 'getIntegrationKeys').callsFake(() => Promise.resolve(data))

            const store = mockStore()
            await store.dispatch(actions.fetchLinkedWeb3Accounts())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.LINKED_WEB3_ACCOUNTS_REQUEST,
                },
                {
                    type: constants.LINKED_WEB3_ACCOUNTS_SUCCESS,
                    payload: {
                        accounts: [{
                            address: data[0].json.address,
                            name: data[0].name,
                        }],
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getIntegrationKeys and handles error', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'getIntegrationKeys').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.fetchLinkedWeb3Accounts())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.LINKED_WEB3_ACCOUNTS_REQUEST,
                },
                {
                    type: constants.LINKED_WEB3_ACCOUNTS_FAILURE,
                    error: true,
                    payload: error,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('getApiKeys', () => {
        it('calls services.getMyKeys, updates API keys and fetches linked web3 accounts', async () => {
            const data = [
                {
                    id: 'testid',
                    name: 'Default',
                    user: 'tester1@streamr.com',
                },
            ]

            const serviceStub = sandbox.stub(services, 'getMyKeys').callsFake(() => Promise.resolve(data))

            const store = mockStore()
            await store.dispatch(actions.getApiKeys())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.API_KEYS_REQUEST,
                },
                {
                    type: constants.API_KEYS_SUCCESS,
                    payload: {
                        apiKey: data[0],
                    },
                },
                {
                    type: constants.LINKED_WEB3_ACCOUNTS_REQUEST,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getMyKeys, logs out if there are errors', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'getMyKeys').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getApiKeys())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.API_KEYS_REQUEST,
                },
                {
                    type: constants.API_KEYS_FAILURE,
                    error: true,
                    payload: error,
                },
                {
                    type: constants.LOGOUT,
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('getUserData', () => {
        it('calls services.getUserData and updates user data', async () => {
            const data = {
                name: 'Tester1',
                username: 'tester1@streamr.com',
                timezone: 'Zulu',
            }

            const serviceStub = sandbox.stub(services, 'getUserData').callsFake(() => Promise.resolve(data))

            const store = mockStore()
            await store.dispatch(actions.getUserData())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.USER_DATA_REQUEST,
                },
                {
                    type: constants.USER_DATA_SUCCESS,
                    payload: {
                        user: data,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getUserData and handles error', async () => {
            const error = new Error('error')
            const serviceStub = sandbox.stub(services, 'getUserData').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getUserData())
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.USER_DATA_REQUEST,
                },
                {
                    type: constants.USER_DATA_FAILURE,
                    error: true,
                    payload: error,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('getUserProductPermissions', () => {
        it('calls services.getUserProductPermissions and sets permissions', async () => {
            const productId = 1
            const data = [
                {
                    id: 1,
                    user: 'tester1@streamr.com',
                    operation: 'read',
                },
                {
                    id: 2,
                    user: 'tester1@streamr.com',
                    operation: 'write',
                },
                {
                    id: 3,
                    anonymous: true,
                },
                {
                    id: 4,
                    user: 'tester1@streamr.com',
                },
            ]

            const serviceStub = sandbox.stub(services, 'getUserProductPermissions').callsFake(() => Promise.resolve(data))

            const store = mockStore()
            await store.dispatch(actions.getUserProductPermissions(productId))
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.GET_USER_PRODUCT_PERMISSIONS_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: constants.GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
                    payload: {
                        read: true,
                        write: true,
                        share: false,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('calls services.getUserProductPermissions and handles error', async () => {
            const productId = 1
            const errorMessage = 'error'
            const serviceStub = sandbox.stub(services, 'getUserProductPermissions').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.getUserProductPermissions(productId))
            assert(serviceStub.calledOnce)

            const expectedActions = [
                {
                    type: constants.GET_USER_PRODUCT_PERMISSIONS_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: constants.GET_USER_PRODUCT_PERMISSIONS_FAILURE,
                    payload: {
                        id: productId,
                        error: {
                            message: errorMessage,
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('startExternalLogin', () => {
        it('sends external login start action', () => {
            const store = mockStore()
            store.dispatch(actions.startExternalLogin())

            const expectedActions = [
                {
                    type: constants.EXTERNAL_LOGIN_START,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('endExternalLogin', () => {
        it('sends external login end action', () => {
            const store = mockStore()
            store.dispatch(actions.endExternalLogin())

            const expectedActions = [
                {
                    type: constants.EXTERNAL_LOGIN_END,
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
