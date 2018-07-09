import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/purchase/reducer'
import * as constants from '../../../../src/modules/purchase/constants'
import { transactionStates } from '../../../../src/utils/constants'

describe('purchase - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('BUY_PRODUCT', () => {
        it('handles request', () => {
            const productId = 'test'
            const subscriptionInSeconds = '200000000'
            const expectedState = {
                hash: null,
                productId,
                receipt: null,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.BUY_PRODUCT_REQUEST,
                payload: {
                    productId,
                    subscriptionInSeconds,
                },
            }), expectedState)
        })

        it('handles transaction hash', () => {
            const txHash = '0x1234'
            const expectedState = {
                ...initialState,
                hash: txHash,
                transactionState: transactionStates.PENDING,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_PURCHASE_HASH,
                payload: {
                    hash: txHash,
                },
            }), expectedState)
        })

        it('handles success', () => {
            const receipt = 'test'
            const expectedState = {
                ...initialState,
                receipt,
                transactionState: transactionStates.CONFIRMED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.BUY_PRODUCT_SUCCESS,
                payload: {
                    receipt,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'test error'
            const expectedState = {
                ...initialState,
                error: {
                    message: errorMessage,
                },
                processing: false,
                transactionState: transactionStates.FAILED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.BUY_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })

    describe('ADD_FREE_PRODUCT', () => {
        it('handles request', () => {
            const productId = 'test'
            const expectedState = {
                hash: null,
                productId,
                receipt: null,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_FREE_PRODUCT_REQUEST,
                payload: {
                    id: productId,
                },
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                transactionState: transactionStates.CONFIRMED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_FREE_PRODUCT_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles error', () => {
            const errorMessage = 'test error'
            const expectedState = {
                ...initialState,
                error: {
                    message: errorMessage,
                },
                processing: false,
                transactionState: transactionStates.FAILED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.ADD_FREE_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })
})
