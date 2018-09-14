import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/publish/reducer'
import * as constants from '../../../../src/modules/publish/constants'
import { transactionStates } from '../../../../src/utils/constants'

describe('publish - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('DEPLOY_PRODUCT', () => {
        it('handles request', () => {
            const productId = 'test'
            const expectedState = {
                hash: null,
                productId,
                receipt: null,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
                isPublish: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.DEPLOY_PRODUCT_REQUEST,
                payload: {
                    id: productId,
                    isPublish: true,
                },
            }), expectedState)
        })

        it('handles transaction hash', () => {
            const productId = 'test'
            const txHash = '0x1234'
            const expectedState = {
                ...initialState,
                hash: txHash,
                transactionState: transactionStates.PENDING,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_DEPLOY_PRODUCT_HASH,
                payload: {
                    id: productId,
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
                type: constants.DEPLOY_PRODUCT_SUCCESS,
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
                type: constants.DEPLOY_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })

    describe('POST_DEPLOY_FREE_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                processing: false,
                transactionState: transactionStates.CONFIRMED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_SUCCESS,
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
                transactionState: transactionStates.FAILED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })

    describe('POST_UNDEPLOY_FREE_PRODUCT', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                processing: true,
                error: null,
                transactionState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                processing: false,
                transactionState: transactionStates.CONFIRMED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
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
                transactionState: transactionStates.FAILED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })

    describe('SET_PRODUCT_DEPLOYING', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                processing: true,
                error: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_DEPLOYING_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                processing: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_DEPLOYING_SUCCESS,
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
                type: constants.SET_PRODUCT_DEPLOYING_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })
})
