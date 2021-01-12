import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/contractProduct/reducer'
import * as constants from '$mp/modules/contractProduct/constants'

describe('contractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('GET_PRODUCT_FROM_CONTRACT', () => {
        it('handles request', () => {
            const expectedState = {
                id: 'test',
                fetchingContractProduct: true,
                contractProductError: null,
                whitelistedAddresses: [],
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_REQUEST,
                payload: {
                    id: 'test',
                },
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                id: 'test',
                fetchingContractProduct: false,
                contractProductError: null,
                whitelistedAddresses: [],
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_SUCCESS,
                payload: {
                    id: 'test',
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('test error')

            const expectedState = {
                id: null,
                fetchingContractProduct: false,
                contractProductError: error,
                whitelistedAddresses: [],
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
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

        assert.deepStrictEqual(reducer(state, {
            type: constants.CLEAR_CONTRACT_PRODUCT,
        }), expectedState)
    })
})
