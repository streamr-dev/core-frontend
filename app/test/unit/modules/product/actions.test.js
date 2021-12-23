import mockStore from '$testUtils/mockStoreProvider'
import * as actions from '$mp/modules/product/actions'
import * as constants from '$mp/modules/product/constants'
import * as services from '$mp/modules/product/services'
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
