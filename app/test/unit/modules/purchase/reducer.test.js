import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/marketplace/modules/purchase/reducer'
import * as constants from '../../../../src/marketplace/modules/purchase/constants'

describe('purchase - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('BUY_PRODUCT', () => {
        it('handles request', () => {
            const productId = 'test'
            const subscriptionInSeconds = '200000000'
            const expectedState = {
                productId,
                processing: true,
                error: null,
                purchaseTx: null,
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
                purchaseTx: txHash,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_PURCHASE_HASH,
                payload: {
                    hash: txHash,
                },
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.BUY_PRODUCT_SUCCESS,
                payload: {},
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
                ...initialState,
                productId,
                processing: true,
                error: null,
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
                processing: false,
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
