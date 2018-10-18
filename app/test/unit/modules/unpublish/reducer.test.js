import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/unpublish/reducer'
import * as constants from '$mp/modules/unpublish/constants'
import { transactionStates } from '$mp/utils/constants'

describe('unpublish - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('UNDEPLOY_PRODUCT', () => {
        it('handles request', () => {
            const productId = 'test'
            const expectedState = {
                ...initialState,
                productId,
                publishingContract: true,
                contractError: null,
                contractTx: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UNDEPLOY_PRODUCT_REQUEST,
                payload: {
                    id: productId,
                },
            }), expectedState)
        })

        it('handles transaction hash', () => {
            const productId = 'test'
            const txHash = '0x1234'
            const expectedState = {
                ...initialState,
                contractTx: txHash,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.RECEIVE_UNDEPLOY_PRODUCT_HASH,
                payload: {
                    id: productId,
                    hash: txHash,
                },
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                publishingContract: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UNDEPLOY_PRODUCT_SUCCESS,
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'test error'
            const expectedState = {
                ...initialState,
                contractError: {
                    message: errorMessage,
                },
                publishingContract: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.UNDEPLOY_PRODUCT_FAILURE,
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
                publishingFree: true,
                freeProductError: null,
                freeProductState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                publishingFree: false,
                freeProductState: transactionStates.CONFIRMED,
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
                freeProductError: {
                    message: errorMessage,
                },
                publishingFree: false,
                freeProductState: transactionStates.FAILED,
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

    describe('SET_PRODUCT_UNDEPLOYING', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                setDeploying: true,
                setDeployingError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_UNDEPLOYING_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                setDeploying: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_UNDEPLOYING_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'test error'
            const expectedState = {
                ...initialState,
                setDeployingError: {
                    message: errorMessage,
                },
                setDeploying: false,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_UNDEPLOYING_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })
})
