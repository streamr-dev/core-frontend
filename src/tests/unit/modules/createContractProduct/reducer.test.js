import assert from 'assert-diff'

import reducer, { initialState } from '../../../../modules/createContractProduct/reducer'
import * as constants from '../../../../modules/createContractProduct/constants'
import { transactionStates } from '../../../../utils/constants'

describe('createContractProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    describe('CREATE_CONTRACT_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                hash: null,
                productId: 'test',
                receipt: null,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
            }

            assert.deepEqual(reducer(undefined, {
                type: constants.CREATE_CONTRACT_PRODUCT_REQUEST,
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

            assert.deepEqual(reducer(undefined, {
                type: constants.CREATE_CONTRACT_PRODUCT_SUCCESS,
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

            assert.deepEqual(reducer(undefined, {
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
            receipt: null,
            processing: false,
            hash: 'hash',
            transactionState: transactionStates.PENDING,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
            payload: {
                hash: 'hash',
            },
        }), expectedState)
    })
})
