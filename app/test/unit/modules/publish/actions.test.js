import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$mp/modules/publish/actions'
import * as constants from '$mp/modules/publish/constants'
import * as entitiesActions from '$shared/modules/entities/actions'
import * as productActions from '$mp/modules/product/actions'
import * as services from '$mp/modules/publish/services'
import * as transactionActions from '$mp/modules/transactions/actions'

// Only affects this test file
jest.setTimeout(6000)

describe('publish - actions', () => {
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

    describe('deployFreeProduct', () => {
        it('calls services.postDeployFree', async () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const ccStub = sandbox.stub(services, 'postDeployFree').callsFake(() => Promise.resolve(product))
            const store = mockStore()
            await store.dispatch(actions.deployFreeProduct(id))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id))
        })

        it('dispatches right actions on postDeployFree() success', async () => {
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }

            sandbox.stub(services, 'postDeployFree').callsFake(() => Promise.resolve(product))

            const store = mockStore()
            await store.dispatch(actions.deployFreeProduct(id))

            const expectedActions = [{
                type: constants.POST_DEPLOY_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: 'updateEntities',
            }, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_SUCCESS,
                payload: {
                    id,
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on postDeployFree() error', async () => {
            const id = 'test'
            const errorMessage = 'error'

            sandbox.stub(services, 'postDeployFree').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.deployFreeProduct(id))

            const expectedActions = [{
                type: constants.POST_DEPLOY_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_FAILURE,
                payload: {
                    id,
                    error: {
                        message: errorMessage,
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('setProductDeploying', () => {
        it('calls services.postSetDeploying', async () => {
            const id = 'test'
            const txHash = '0x1234'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const ccStub = sandbox.stub(services, 'postSetDeploying').callsFake(() => Promise.resolve(product))
            const store = mockStore()
            await store.dispatch(actions.setProductDeploying(id, txHash))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id))
        })

        it('dispatches right actions on postUndeployFree() success', async () => {
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))

            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }

            sandbox.stub(services, 'postSetDeploying').callsFake(() => Promise.resolve(product))

            const store = mockStore()
            await store.dispatch(actions.setProductDeploying(id))

            const expectedActions = [{
                type: constants.SET_PRODUCT_DEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: 'updateEntities',
            }, {
                type: constants.SET_PRODUCT_DEPLOYING_SUCCESS,
                payload: {
                    id,
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on postUndeployFree() error', async () => {
            const id = 'test'
            const errorMessage = 'error'

            sandbox.stub(services, 'postSetDeploying').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.setProductDeploying(id))

            const expectedActions = [{
                type: constants.SET_PRODUCT_DEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.SET_PRODUCT_DEPLOYING_FAILURE,
                payload: {
                    id,
                    error: {
                        message: errorMessage,
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('redeployProduct', () => {
        it('calls services.redeployProduct', async () => {
            const id = 'test'
            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            const ccStub = sandbox.stub(services, 'redeployProduct').callsFake(() => cc)
            const store = mockStore()
            await store.dispatch(actions.redeployProduct(id))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id))
        })

        it('dispatches right actions on redeployProduct().onTransactionHash', () => {
            sandbox.stub(transactionActions, 'addTransaction').callsFake(() => ({
                type: 'addTransaction',
            }))
            const id = '1234'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const hash = 'testHash'
            const cc = {
                onTransactionHash: (cb) => {
                    cb(hash)
                    return cc
                },
                onTransactionComplete: () => cc,
                onError: () => cc,
            }

            sandbox.stub(services, 'redeployProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.redeployProduct(id, product))
            const expectedActions = [{
                type: constants.DEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.RECEIVE_DEPLOY_PRODUCT_HASH,
                payload: {
                    hash,
                },
            }, {
                type: 'addTransaction',
            }, {
                type: constants.SET_PRODUCT_DEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on redeployProduct().onTransactionComplete', (done) => {
            const id = 'test'
            const receipt = {
                a: 'receipt',
                with: 'no',
                proper: 'schema',
            }

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'redeployProduct').callsFake(() => cc)
            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: `/product/${id}`,
                    },
                    action: {},
                },
            })
            store.dispatch(actions.redeployProduct(id))

            const expectedActions = [{
                type: constants.DEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.DEPLOY_PRODUCT_SUCCESS,
            }, {
                type: 'getProductById',
                id: 'test',
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('doesnt dispatch getProductById if not on product page', (done) => {
            const id = 'test'
            const receipt = {
                a: 'receipt',
                with: 'no',
                proper: 'schema',
            }

            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'redeployProduct').callsFake(() => cc)

            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: '/product/notProperId',
                    },
                    action: {},
                },
            })
            store.dispatch(actions.redeployProduct(id))
            const expectedActions = [{
                type: constants.DEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.DEPLOY_PRODUCT_SUCCESS,
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('dispatches right actions on redeployProduct().onError', () => {
            const id = 'test'
            const error = new Error('test error')
            sandbox.stub(productActions, 'getProductById').callsFake((idToGet) => ({
                type: 'getProductById',
                id: idToGet,
            }))

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: (cb) => {
                    cb(error)
                    return cc
                },
            }

            sandbox.stub(services, 'redeployProduct').callsFake(() => cc)

            const store = mockStore()
            store.dispatch(actions.redeployProduct(id))
            const expectedActions = [{
                type: constants.DEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.DEPLOY_PRODUCT_FAILURE,
                payload: {
                    id,
                    error: {
                        message: error.message,
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })
})
