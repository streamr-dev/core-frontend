import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/createContractProduct/reducer'
import * as constants from '$mp/modules/createContractProduct/constants'

describe('createContractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('CREATE_CONTRACT_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                productId: 'test',
                processing: true,
                error: null,
                modifyTx: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
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
                type: constants.CREATE_CONTRACT_PRODUCT_SUCCESS,
                payload: {
                    receipt: 'receipt',
                },
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
                type: constants.CREATE_CONTRACT_PRODUCT_FAILURE,
                payload: {
                    error,
                },
            }), expectedState)
        })
    })

    it('handles RECEIVE_CREATE_CONTRACT_PRODUCT_HASH', () => {
        const expectedState = {
            error: null,
            productId: null,
            processing: false,
            modifyTx: 'hash',
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
            payload: {
                hash: 'hash',
            },
        }), expectedState)
    })
})
