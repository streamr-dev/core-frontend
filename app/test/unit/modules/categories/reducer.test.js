import reducer, { initialState } from '$mp/modules/categories/reducer'
import * as constants from '$mp/modules/categories/constants'

describe('categories - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ids: [],
            fetching: true,
            error: null,
        }

        expect(reducer(undefined, {
            type: constants.GET_CATEGORIES_REQUEST,
            payload: {},
        })).toStrictEqual(expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ids: [1, 2],
            fetching: false,
            error: null,
        }

        expect(reducer(undefined, {
            type: constants.GET_CATEGORIES_SUCCESS,
            payload: {
                categories: [1, 2],
            },
        })).toStrictEqual(expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ids: [],
            fetching: false,
            error,
        }

        expect(reducer(undefined, {
            type: constants.GET_CATEGORIES_FAILURE,
            payload: {
                error,
            },
        })).toStrictEqual(expectedState)
    })
})
