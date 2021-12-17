import reducer, { initialState } from '$mp/modules/product/reducer'
import * as constants from '$mp/modules/product/constants'

describe('product - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('getProductSubscriptionFromContract', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingContractSubscription: true,
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const subscription = {
                id: 1,
                name: 'Test 1',
            }
            const expectedState = {
                ...initialState,
                fetchingContractSubscription: false,
                contractSubscription: subscription,
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
                payload: {
                    subscription,
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingContractSubscription: false,
                contractSubscription: null,
                contractSubscriptionError: error,
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
    })
})
