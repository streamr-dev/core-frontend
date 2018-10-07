import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/updateContractProduct/reducer'
import * as constants from '$mp/modules/updateContractProduct/constants'

describe('updateContractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('UPDATE_CONTRACT_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                productId: 'test',
                processing: true,
                error: null,
                modifyTx: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UPDATE_CONTRACT_PRODUCT_REQUEST,
                payload: {
                    productId: 'test',
                },
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                error: null,
                productId: null,
                processing: false,
                modifyTx: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UPDATE_CONTRACT_PRODUCT_SUCCESS,
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('test error')
            const expectedState = {
                productId: null,
                processing: false,
                error,
                modifyTx: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UPDATE_CONTRACT_PRODUCT_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    it('handles RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH', () => {
        const expectedState = {
            error: null,
            productId: null,
            processing: false,
            modifyTx: 'hash',
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
            payload: {
                hash: 'hash',
            },
        }), expectedState)
    })

    it('handles UPDATE_CONTRACT_PRODUCT_RESET', () => {
        const expectedState = {
            error: null,
            productId: null,
            processing: false,
            modifyTx: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.UPDATE_CONTRACT_PRODUCT_RESET,
        }), expectedState)
    })
})
