import reducer, { initialState } from '$mp/modules/contractProduct/reducer'
import * as constants from '$mp/modules/contractProduct/constants'

describe('contractProduct - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('GET_PRODUCT_FROM_CONTRACT', () => {
        it('handles request', () => {
            const expectedState = {
                id: 'test',
                fetchingContractProduct: true,
                contractProductError: null,
                whitelistedAddresses: [],
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                payload: {
                    id: 'test',
                },
            })).toStrictEqual(expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                id: 'test',
                fetchingContractProduct: false,
                contractProductError: null,
                whitelistedAddresses: [],
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_SUCCESS,
                payload: {
                    id: 'test',
                },
            })).toStrictEqual(expectedState)
        })

        it('handles failure', () => {
            const error = new Error('test error')

            const expectedState = {
                id: null,
                fetchingContractProduct: false,
                contractProductError: error,
                whitelistedAddresses: [],
            }

            expect(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                payload: {
                    error,
                },
            })).toStrictEqual(expectedState)
        })
    })

    it('handles CLEAR_CONTRACT_PRODUCT', () => {
        const state = {
            id: 'test',
            fetchingContractProduct: true,
            contractProductError: 'error',
            whitelistedAddresses: [],
        }
        const expectedState = {
            id: null,
            fetchingContractProduct: false,
            contractProductError: null,
            whitelistedAddresses: [],
        }

        expect(reducer(state, {
            type: constants.CLEAR_CONTRACT_PRODUCT,
        })).toStrictEqual(expectedState)
    })
})
