import assert from 'assert-diff'
import sinon from 'sinon'
import { normalize } from 'normalizr'
import { CALL_HISTORY_METHOD } from 'connected-react-router'

import mockStore from '$testUtils/mockStoreProvider'
import * as actions from '$mp/modules/product/actions'
import * as constants from '$mp/modules/product/constants'
import * as services from '$mp/modules/product/services'
import * as entityConstants from '$shared/modules/entities/constants'
import { productSchema, streamsSchema } from '$shared/modules/entities/schema'
import { initialState } from '$mp/modules/product/reducer'

jest.mock('$shared/utils/url', () => (
    {
        formatApiUrl: () => 'TEST_formatApiUrl_result',
        formatExternalUrl: () => 'TEST_formatExternalUrl_result',
        formatPath: () => 'TEST_formatPath_result',
    }
))
jest.mock('$mp/modules/myPurchaseList/actions', () => (
    {
        getMyPurchases: () => (dispatch) => (
            new Promise((resolve) => {
                dispatch({
                    type: 'TEST_GET_MY_PURCHASES',
                })
                resolve()
            })
        ),
    }
))
jest.mock('$mp/modules/purchase/actions', () => (
    {
        addFreeProduct: (id) => (dispatch) => (
            new Promise((resolve) => {
                dispatch({
                    type: 'TEST_ADD_FREE_PRODUCT',
                    payload: {
                        id,
                    },
                })
                resolve()
            })
        ),
    }
))

describe('product - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getStreamsByProductId', () => {
        it('gets streams for product succesfully', async () => {
            const productId = '123'
            const streams = [
                {
                    id: '1',
                    name: 'Test 1',
                    description: 'Description 1',
                },
                {
                    id: '2',
                    name: 'Test 2',
                    description: 'Description 2',
                },
            ]
            const { result, entities } = normalize(streams, streamsSchema)

            sandbox.stub(services, 'getStreamsByProductId').callsFake(() => Promise.resolve(streams))

            const store = mockStore()
            await store.dispatch(actions.getStreamsByProductId(productId))

            const expectedActions = [
                {
                    type: constants.GET_STREAMS_BY_PRODUCT_ID_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
                    payload: {
                        id: productId,
                        streams: result,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const productId = '234'
            const error = new Error('Error')
            sandbox.stub(services, 'getStreamsByProductId').callsFake(() => Promise.reject(error))

            const store = mockStore()
            await store.dispatch(actions.getStreamsByProductId(productId))

            const expectedActions = [
                {
                    type: constants.GET_STREAMS_BY_PRODUCT_ID_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: constants.GET_STREAMS_BY_PRODUCT_ID_FAILURE,
                    payload: {
                        id: productId,
                        error,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('getProductById', () => {
        it('gets product by id', async () => {
            const productId = '918'
            const product = {
                key: 'asd-123',
                id: productId,
                name: 'Product 1',
                description: 'Description 1',
                owner: 'Owner Name',
                category: 'cat-1',
                minimumSubscriptionInSeconds: 1,
                ownerAddress: '0x123',
                beneficiaryAddress: '0x456',
                pricePerSecond: '12',
                priceCurrency: 'DATA',
            }
            const { result, entities } = normalize(product, productSchema)

            sandbox.stub(services, 'getProductById').callsFake(() => Promise.resolve(product))

            const store = mockStore({
                product: {
                    id: productId,
                },
                entities: {
                    products: {
                        [productId]: {
                            id: productId,
                            name: 'Test product',
                        },
                    },
                },
            })
            await store.dispatch(actions.getProductById(productId))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_BY_ID_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_PRODUCT_BY_ID_SUCCESS,
                    payload: {
                        id: result,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const productId = '456666345'
            const error = {
                message: 'Error',
                code: 'test',
                statusCode: 123,
            }
            sandbox.stub(services, 'getProductById').callsFake(() => Promise.reject(error))

            const store = mockStore({
                product: {
                    id: productId,
                },
                entities: {
                    products: {
                        [productId]: {
                            id: productId,
                            name: 'Test product',
                        },
                    },
                },
            })
            await store.dispatch(actions.getProductById(productId))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_BY_ID_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: constants.GET_PRODUCT_BY_ID_FAILURE,
                    payload: {
                        id: productId,
                        error,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('getProductSubscription', () => {
        it('gets subscription for product', async () => {
            const productId = '666'
            const productSubscription = {
                productId,
                endTimestamp: 12345,
            }

            sandbox.stub(services, 'getMyProductSubscription').callsFake(() => Promise.resolve(productSubscription))

            const store = mockStore({
                product: initialState,
            })
            await store.dispatch(actions.getProductSubscription(productId))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: 'TEST_GET_MY_PURCHASES',
                },
                {
                    type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
                    payload: {
                        id: productId,
                        subscription: productSubscription,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('responds to errors', async () => {
            const productId = '1012309'
            const error = new Error('Test error message')
            sandbox.stub(services, 'getMyProductSubscription').callsFake(() => Promise.reject(error))

            const store = mockStore({
                product: initialState,
            })
            await store.dispatch(actions.getProductSubscription(productId))

            const expectedActions = [
                {
                    type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
                    payload: {
                        id: productId,
                    },
                },
                {
                    type: 'TEST_GET_MY_PURCHASES',
                },
                {
                    type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
                    payload: {
                        id: productId,
                        error: {
                            message: error.message,
                        },
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })
    })

    describe('purchaseProduct', () => {
        it('purchases a paid product', async () => {
            const productId = '1337'
            const store = mockStore({
                product: {
                    id: productId,
                },
                entities: {
                    products: {
                        [productId]: {
                            id: productId,
                            name: 'Test product',
                            pricePerSecond: 123,
                            isFree: false,
                        },
                    },
                },
            })
            await store.dispatch(actions.purchaseProduct())

            const expectedActions = [
                {
                    type: CALL_HISTORY_METHOD,
                    payload: {
                        method: 'replace',
                        args: [
                            'TEST_formatPath_result',
                        ],
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('adds a free product to my products', async () => {
            const productId = '1337'
            const store = mockStore({
                product: {
                    id: productId,
                },
                entities: {
                    products: {
                        [productId]: {
                            id: productId,
                            name: 'Test product',
                            pricePerSecond: 0,
                            isFree: true,
                        },
                    },
                },
            })
            await store.dispatch(actions.purchaseProduct())

            const expectedActions = [
                {
                    type: 'TEST_ADD_FREE_PRODUCT',
                    payload: {
                        id: productId,
                    },
                },
            ]
            assert.deepStrictEqual(store.getActions(), expectedActions)
        })

        it('skips if no product is selected', async () => {
            const store = mockStore({
                product: {
                    id: null,
                },
            })
            await store.dispatch(actions.purchaseProduct())

            const expectedActions = []
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

        it('handles anonymous permission as read', async () => {
            const productId = 1
            const data = [{
                id: 3,
                anonymous: true,
            }]

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
                        write: false,
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
})
