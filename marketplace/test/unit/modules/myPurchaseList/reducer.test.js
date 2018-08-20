import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/myPurchaseList/reducer'
import * as constants from '../../../../src/modules/myPurchaseList/constants'

describe('myPurchaseList - reducer', () => {
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
            type: constants.GET_MY_PURCHASES_REQUEST,
            payload: {},
        }), expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ...initialState,
            ids: [1, 2, 3],
            fetching: false,
            error: null,
        }
        const reducerState = reducer(undefined, {
            type: constants.GET_MY_PURCHASES_SUCCESS,
            payload: {
                products: [1, 2, 3],
            },
        })
        assert.deepStrictEqual(reducerState, expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ...initialState,
            ids: [],
            fetching: false,
            error,
        }

        const reducerState = reducer(undefined, {
            type: constants.GET_MY_PURCHASES_FAILURE,
            payload: {
                error,
            },
        })
        assert.deepStrictEqual(reducerState, expectedState)
    })
})
