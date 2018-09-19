import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/marketplace/modules/updateContractProduct/reducer'
import * as constants from '../../../../src/marketplace/modules/updateContractProduct/constants'
import { transactionStates } from '../../../../src/marketplace/utils/constants'

describe('updateContractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('UPDATE_CONTRACT_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                hash: null,
                productId: 'test',
                receipt: null,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
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
                hash: null,
                productId: null,
                receipt: 'receipt',
                processing: false,
                transactionState: transactionStates.CONFIRMED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UPDATE_CONTRACT_PRODUCT_SUCCESS,
                payload: {
                    receipt: 'receipt',
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const error = new Error('test error')
            const expectedState = {
                hash: null,
                productId: null,
                receipt: null,
                processing: false,
                transactionState: transactionStates.FAILED,
                error,
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
            receipt: null,
            processing: false,
            hash: 'hash',
            transactionState: transactionStates.PENDING,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
            payload: {
                hash: 'hash',
            },
        }), expectedState)
    })
})
