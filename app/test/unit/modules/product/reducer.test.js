import reducer, { initialState } from '$mp/modules/product/reducer'
import * as constants from '$mp/modules/product/constants'

describe('product - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('getProductById', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                id: 1,
                fetchingProduct: true,
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_BY_ID_REQUEST,
                payload: {
                    id: 1,
                },
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                fetchingProduct: false,
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_BY_ID_SUCCESS,
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingProduct: false,
                productError: error,
            }

            const state = reducer(undefined, {
                type: constants.GET_PRODUCT_BY_ID_FAILURE,
                payload: {
                    error,
                },
            })
            expect(state).toStrictEqual(expectedState)
        })
    })

    describe('getStreamsByProductId', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingStreams: true,
                streamsError: null,
                streams: [],
            }

            expect(reducer(undefined, {
                type: constants.GET_STREAMS_BY_PRODUCT_ID_REQUEST,
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const streams = [
                {
                    id: 1,
                    name: 'Test 1',
                },
            ]
            const expectedState = {
                ...initialState,
                fetchingStreams: false,
                streamsError: null,
                streams,
            }

            expect(reducer(undefined, {
                type: constants.GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
                payload: {
                    streams,
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('Test')

            const expectedState = {
                ...initialState,
                fetchingStreams: false,
                streamsError: error,
            }

            expect(reducer(undefined, {
                type: constants.GET_STREAMS_BY_PRODUCT_ID_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
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
