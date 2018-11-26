import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/publish/reducer'
import * as constants from '$mp/modules/publish/constants'
import { transactionStates } from '$mp/utils/constants'

describe('publish - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('DEPLOY_PRODUCT', () => {
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
                type: constants.DEPLOY_PRODUCT_REQUEST,
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
                type: constants.RECEIVE_DEPLOY_PRODUCT_HASH,
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
                type: constants.DEPLOY_PRODUCT_SUCCESS,
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
                publishingFree: true,
                freeProductError: null,
                freeProductState: transactionStates.STARTED,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.POST_DEPLOY_FREE_PRODUCT_REQUEST,
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
                type: constants.POST_DEPLOY_FREE_PRODUCT_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'test error'
            const expectedState = {
                ...initialState,
                publishingFree: false,
                freeProductError: {
                    message: errorMessage,
                },
                freeProductState: transactionStates.FAILED,
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

    describe('SET_PRODUCT_DEPLOYING', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                setDeploying: true,
                setDeployingError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.SET_PRODUCT_DEPLOYING_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                setDeploying: false,
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
                setDeployingError: {
                    message: errorMessage,
                },
                setDeploying: false,
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
