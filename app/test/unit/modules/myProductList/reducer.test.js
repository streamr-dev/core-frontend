import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/marketplace/modules/myProductList/reducer'
import * as constants from '../../../../src/marketplace/modules/myProductList/constants'

describe('myProductList - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ...initialState,
            fetching: true,
            error: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_REQUEST,
        }), expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ...initialState,
            ids: [1337, 1338],
            fetching: false,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_SUCCESS,
            payload: {
                products: [1337, 1338],
            },
        }), expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test Error')

        const expectedState = {
            ...initialState,
            fetching: false,
            error,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })
})

