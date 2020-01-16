import assert from 'assert-diff'

import { cloneDeep } from 'lodash'
import reducer, { initialState } from '$mp/modules/deprecated/editProduct/reducer'
import * as constants from '$mp/modules/deprecated/editProduct/constants'
import { transactionStates } from '$shared/utils/constants'

describe('editProduct - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), cloneDeep(initialState))
    })

    it('updates product', () => {
        const expectedState = {
            ...initialState,
            product: {
                id: '123abc',
            },
        }

        const reducerState = reducer(undefined, {
            type: constants.UPDATE_PRODUCT,
            payload: {
                product: {
                    id: '123abc',
                },
            },
        })

        assert.deepStrictEqual(reducerState, expectedState)
    })

    it('updates product field', () => {
        const expectedState = {
            ...initialState,
            product: {
                name: 'Herp Derp',
            },
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.UPDATE_PRODUCT_FIELD,
            payload: {
                field: 'name',
                data: 'Herp Derp',
            },
        }), expectedState)
    })

    it('resets product', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.RESET_PRODUCT,
        }), initialState)
    })

    it('put product request', () => {
        const expectedState = {
            ...initialState,
            sending: true,
            transactionState: transactionStates.STARTED,
        }
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.PUT_PRODUCT_REQUEST,
        }), expectedState)
    })

    it('put product success', () => {
        const expectedState = {
            ...initialState,
            sending: false,
            transactionState: transactionStates.CONFIRMED,
        }
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.PUT_PRODUCT_SUCCESS,
        }), expectedState)
    })

    it('put product failure', () => {
        const expectedState = {
            ...initialState,
            sending: false,
            error: true,
            transactionState: transactionStates.FAILED,
        }
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.PUT_PRODUCT_FAILURE,
            payload: {
                error: true,
            },
        }), expectedState)
    })

    it('resets put product transaction', () => {
        const expectedState = {
            ...initialState,
            sending: false,
            error: null,
            transactionState: null,
        }
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.PUT_PRODUCT_RESET,
        }), expectedState)
    })

    it('post product request', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.POST_PRODUCT_REQUEST,
        }), {
            ...initialState,
            sending: true,
        })
    })

    it('post product success', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.POST_PRODUCT_SUCCESS,
        }), {
            ...initialState,
            sending: false,
        })
    })

    it('post product failure', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.POST_PRODUCT_FAILURE,
            payload: {
                error: true,
            },
        }), {
            ...initialState,
            sending: false,
            error: true,
        })
    })

    it('handles image upload set image', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.IMAGE_UPLOAD_SET_IMAGE,
            payload: {
                image: 'test',
            },
        }), {
            ...initialState,
            imageToUpload: 'test',
        })
    })

    it('handles image upload request', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.IMAGE_UPLOAD_REQUEST,
        }), {
            ...initialState,
            uploadingImage: true,
        })
    })

    it('handles image upload success', () => {
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.IMAGE_UPLOAD_SUCCESS,
        }), {
            ...initialState,
            uploadingImage: false,
            imageError: null,
            imageToUpload: null,
        })
    })

    it('handles image upload failure', () => {
        const err = new Error('error')
        assert.deepStrictEqual(reducer(undefined, {
            type: constants.IMAGE_UPLOAD_FAILURE,
            payload: {
                error: err,
            },
        }), {
            ...initialState,
            uploadingImage: false,
            imageError: err,
        })
    })
})
