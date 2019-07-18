import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$mp/modules/unpublish/actions'
import * as constants from '$mp/modules/unpublish/constants'
import * as entitiesActions from '$shared/modules/entities/actions'
import * as productActions from '$mp/modules/product/actions'
import * as services from '$mp/modules/unpublish/services'
import * as transactionActions from '$mp/modules/transactions/actions'

// Only affects this test file
jest.setTimeout(6000)

describe('unpublish - actions', () => {
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

    describe('undeployFreeProduct', () => {
        it('calls services.postUndeployFree', async () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const ccStub = sandbox.stub(services, 'postUndeployFree').callsFake(() => Promise.resolve(product))
            const store = mockStore()
            await store.dispatch(actions.undeployFreeProduct(id))
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

            sandbox.stub(services, 'postUndeployFree').callsFake(() => Promise.resolve(product))

            const store = mockStore()
            await store.dispatch(actions.undeployFreeProduct(id))

            const expectedActions = [{
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: 'updateEntities',
            }, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
                payload: {
                    id,
                },
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on postUndeployFree() error', async () => {
            const id = 'test'
            const errorMessage = 'error'

            sandbox.stub(services, 'postUndeployFree').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.undeployFreeProduct(id))

            const expectedActions = [{
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
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

    describe('setProductUndeploying', () => {
        it('calls services.postSetDeploying', async () => {
            const id = 'test'
            const txHash = '0x1234'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const ccStub = sandbox.stub(services, 'postSetUndeploying').callsFake(() => Promise.resolve(product))
            const store = mockStore()
            await store.dispatch(actions.setProductUndeploying(id, txHash))
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

            sandbox.stub(services, 'postSetUndeploying').callsFake(() => Promise.resolve(product))

            const store = mockStore()
            await store.dispatch(actions.setProductUndeploying(id))

            const expectedActions = [{
                type: constants.SET_PRODUCT_UNDEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: 'updateEntities',
            }, {
                type: constants.SET_PRODUCT_UNDEPLOYING_SUCCESS,
                payload: {
                    id,
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on postSetUndeploying() error', async () => {
            const id = 'test'
            const errorMessage = 'error'

            sandbox.stub(services, 'postSetUndeploying').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.setProductUndeploying(id))

            const expectedActions = [{
                type: constants.SET_PRODUCT_UNDEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.SET_PRODUCT_UNDEPLOYING_FAILURE,
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

    describe('deleteProduct', () => {
        it('calls services.deleteProduct', async () => {
            const id = 'test'
            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            const ccStub = sandbox.stub(services, 'deleteProduct').callsFake(() => cc)
            const store = mockStore()
            await store.dispatch(actions.deleteProduct(id))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id))
        })

        it('dispatches right actions on deleteProduct().onTransactionHash', () => {
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

            sandbox.stub(services, 'deleteProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.deleteProduct(id, product))
            const expectedActions = [{
                type: constants.UNDEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.RECEIVE_UNDEPLOY_PRODUCT_HASH,
                payload: {
                    hash,
                },
            }, {
                type: 'addTransaction',
            }, {
                type: constants.SET_PRODUCT_UNDEPLOYING_REQUEST,
                payload: {
                    id,
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on deleteProduct().onTransactionComplete', (done) => {
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
            sandbox.stub(services, 'deleteProduct').callsFake(() => cc)
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

            store.dispatch(actions.deleteProduct(id))

            const expectedActions = [{
                type: constants.UNDEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.UNDEPLOY_PRODUCT_SUCCESS,
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
            sandbox.stub(services, 'deleteProduct').callsFake(() => cc)

            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: '/product/notProperId',
                    },
                    action: {},
                },
            })
            store.dispatch(actions.deleteProduct(id))
            const expectedActions = [{
                type: constants.UNDEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.UNDEPLOY_PRODUCT_SUCCESS,
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('dispatches right actions on deleteProduct().onError', () => {
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

            sandbox.stub(services, 'deleteProduct').callsFake(() => cc)

            const store = mockStore()
            store.dispatch(actions.deleteProduct(id))
            const expectedActions = [{
                type: constants.UNDEPLOY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                },
            }, {
                type: constants.UNDEPLOY_PRODUCT_FAILURE,
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
