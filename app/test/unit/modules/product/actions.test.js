import { normalize } from 'normalizr'

import mockStore from '$testUtils/mockStoreProvider'
import * as actions from '$mp/modules/product/actions'
import * as constants from '$mp/modules/product/constants'
import * as services from '$mp/modules/product/services'
import * as entityConstants from '$shared/modules/entities/constants'
import { streamsSchema } from '$shared/modules/entities/schema'
import { initialState } from '$mp/modules/product/reducer'

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

describe('product - actions', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
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

            jest.spyOn(services, 'getStreamsByProductId').mockImplementation(() => Promise.resolve(streams))

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
            expect(store.getActions()).toStrictEqual(expectedActions)
        })

        it('responds to errors', async () => {
            const productId = '234'
            const error = new Error('Error')
            jest.spyOn(services, 'getStreamsByProductId').mockImplementation(() => Promise.reject(error))

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
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })

    describe('getProductSubscription', () => {
        it('gets subscription for product', async () => {
            const productId = '666'
            const productSubscription = {
                productId,
                endTimestamp: 12345,
            }

            jest.spyOn(services, 'getMyProductSubscription').mockImplementation(() => Promise.resolve(productSubscription))

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
            expect(store.getActions()).toStrictEqual(expectedActions)
        })

        it('responds to errors', async () => {
            const productId = '1012309'
            const error = new Error('Test error message')
            jest.spyOn(services, 'getMyProductSubscription').mockImplementation(() => Promise.reject(error))

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
            expect(store.getActions()).toStrictEqual(expectedActions)
        })
    })
})
