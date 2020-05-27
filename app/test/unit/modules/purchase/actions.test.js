import assert from 'assert-diff'
import sinon from 'sinon'
import mockStore from '$testUtils/mockStoreProvider'

import * as actions from '$mp/modules/purchase/actions'
import * as constants from '$mp/modules/purchase/constants'
import * as productActions from '$mp/modules/product/actions'
import * as services from '$mp/modules/purchase/services'
import * as myPurchaseConstants from '$mp/modules/myPurchaseList/constants'
import * as transactionActions from '$mp/modules/transactions/actions'

// Only affects this test file
jest.setTimeout(6000)

describe('purchase - actions', () => {
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

    describe('buyProduct', () => {
        it('calls services.buyProduct', async () => {
            const id = 'test'
            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            const subscriptionInSeconds = '200000000'
            const paymentCurrency = 'DATA'
            const price = '1234'

            const ccStub = sandbox.stub(services, 'buyProduct').callsFake(() => cc)
            const store = mockStore()
            await store.dispatch(actions.buyProduct(id, subscriptionInSeconds, paymentCurrency, price))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id, subscriptionInSeconds, paymentCurrency, price))
        })

        it('dispatches right actions on buyProduct().onTransactionHash', async () => {
            sandbox.stub(transactionActions, 'addTransaction').callsFake((id) => ({
                type: 'addTransaction',
                id,
            }))

            const id = 'test'
            const hash = 'testHash'
            const cc = {
                onTransactionHash: (cb) => {
                    cb(hash)
                    return cc
                },
                onTransactionComplete: () => cc,
                onError: () => cc,
            }
            const subscriptionInSeconds = '200000000'
            const paymentCurrency = 'DATA'
            const price = '1234'

            sandbox.stub(services, 'buyProduct').callsFake(() => cc)
            const store = mockStore()
            store.dispatch(actions.buyProduct(id, subscriptionInSeconds, paymentCurrency, price))

            const expectedActions = [{
                type: constants.BUY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    subscriptionInSeconds,
                },
            }, {
                type: constants.RECEIVE_PURCHASE_HASH,
                payload: {
                    hash,
                },
            }, {
                type: 'addTransaction',
                id: hash,
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on buyProduct().onTransactionComplete', (done) => {
            const id = 'test'
            const transactionHash = 'testHash'
            const receipt = {
                a: 'receipt',
                with: 'no',
                proper: 'schema',
                transactionHash,
            }
            const subscriptionInSeconds = '200000000'
            const paymentCurrency = 'DATA'
            const price = '1234'

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: (cb) => {
                    cb(receipt)
                    return cc
                },
                onError: () => cc,
            }
            sandbox.stub(services, 'buyProduct').callsFake(() => cc)
            sandbox.stub(productActions, 'getProductSubscription').callsFake((idToGet) => ({
                type: 'getProductSubscription',
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

            store.dispatch(actions.buyProduct(id, subscriptionInSeconds, paymentCurrency, price))

            const expectedActions = [{
                type: constants.BUY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    subscriptionInSeconds,
                },
            }, {
                type: constants.BUY_PRODUCT_SUCCESS,
            }, {
                type: 'getProductSubscription',
                id: 'test',
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('doesnt dispatch getProductSubscription if not on product page', (done) => {
            const id = 'test'
            const transactionHash = 'testHash'
            const receipt = {
                a: 'receipt',
                with: 'no',
                proper: 'schema',
                transactionHash,
            }
            const subscriptionInSeconds = '200000000'
            const paymentCurrency = 'DATA'
            const price = '1234'

            sandbox.stub(productActions, 'getProductSubscription').callsFake((idToGet) => ({
                type: 'getProductSubscription',
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
            sandbox.stub(services, 'buyProduct').callsFake(() => cc)

            // Couldn't mock react-router-redux's getLocation for some reason so let's use the real one
            const store = mockStore({
                router: {
                    location: {
                        pathname: '/product/notProperId',
                    },
                    action: {},
                },
            })
            store.dispatch(actions.buyProduct(id, subscriptionInSeconds, paymentCurrency, price))
            const expectedActions = [{
                type: constants.BUY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    subscriptionInSeconds,
                },
            }, {
                type: constants.BUY_PRODUCT_SUCCESS,
            }]
            setTimeout(() => {
                assert.deepStrictEqual(store.getActions(), expectedActions)
                done()
            }, 5000)
        })

        it('dispatches right actions on buyProduct().onError', () => {
            const id = 'test'
            const error = new Error('test error')

            const cc = {
                onTransactionHash: () => cc,
                onTransactionComplete: () => cc,
                onError: (cb) => {
                    cb(error)
                    return cc
                },
            }
            const subscriptionInSeconds = '200000000'
            const paymentCurrency = 'DATA'
            const price = '1234'

            sandbox.stub(services, 'buyProduct').callsFake(() => cc)

            const store = mockStore()
            store.dispatch(actions.buyProduct(id, subscriptionInSeconds, paymentCurrency, price))
            const expectedActions = [{
                type: constants.BUY_PRODUCT_REQUEST,
                payload: {
                    productId: id,
                    subscriptionInSeconds,
                },
            }, {
                type: constants.BUY_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: error.message,
                    },
                },
            }]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('addFreeProduct', () => {
        it('calls services.addFreeProduct', async () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }
            const ccStub = sandbox.stub(services, 'addFreeProduct').callsFake(() => Promise.resolve(product))
            const store = mockStore()
            await store.dispatch(actions.addFreeProduct(id))
            assert(ccStub.calledOnce)
            assert(ccStub.calledWith(id))
        })

        it('dispatches right actions on addFreeProduct() success', async () => {
            const id = 'test'
            const product = {
                field: 1,
                anotherField: 'two',
            }

            sandbox.stub(services, 'addFreeProduct').callsFake(() => Promise.resolve(product))

            const store = mockStore()
            await store.dispatch(actions.addFreeProduct(id))

            const expectedActions = [{
                type: constants.ADD_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.ADD_FREE_PRODUCT_SUCCESS,
            }, {
                type: myPurchaseConstants.GET_MY_PURCHASES_REQUEST,
            }]

            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('dispatches right actions on postDeployFree() error', async () => {
            const id = 'test'
            const errorMessage = 'error'

            sandbox.stub(services, 'addFreeProduct').callsFake(() => Promise.reject(new Error(errorMessage)))

            const store = mockStore()
            await store.dispatch(actions.addFreeProduct(id))

            const expectedActions = [{
                type: constants.ADD_FREE_PRODUCT_REQUEST,
                payload: {
                    id,
                },
            }, {
                type: constants.ADD_FREE_PRODUCT_FAILURE,
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
})
