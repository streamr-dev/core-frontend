import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/marketplace/modules/categories/reducer'
import * as constants from '../../../../src/marketplace/modules/categories/constants'

describe('categories - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ids: [],
            fetching: true,
            error: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_CATEGORIES_REQUEST,
            payload: {},
        }), expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ids: [1, 2],
            fetching: false,
            error: null,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_CATEGORIES_SUCCESS,
            payload: {
                categories: [1, 2],
            },
        }), expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ids: [],
            fetching: false,
            error,
        }

        assert.deepStrictEqual(reducer(undefined, {
            type: constants.GET_CATEGORIES_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })
})
