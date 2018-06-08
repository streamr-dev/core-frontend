import assert from 'assert-diff'

import reducer, { initialState } from '../../../../modules/contractProduct/reducer'
import * as constants from '../../../../modules/contractProduct/constants'

describe('contractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    describe('GET_PRODUCT_FROM_CONTRACT', () => {
        it('handles request', () => {
            const expectedState = {
                id: 'test',
                fetchingContractProduct: true,
                contractProductError: null,
            }

            assert.deepEqual(reducer(undefined, {
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
            }

            assert.deepEqual(reducer(undefined, {
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
            }

            assert.deepEqual(reducer(undefined, {
                type: constants.GET_PRODUCT_FROM_CONTRACT_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })
})
