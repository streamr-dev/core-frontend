import reducer, { initialState } from '$mp/modules/relatedProducts/reducer'
import * as constants from '$mp/modules/relatedProducts/constants'

describe('relatedProducts - reducers', () => {
    it('has initial state', async () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ids: [],
            fetching: true,
            error: null,
        }

        expect(reducer(undefined, {
            type: constants.GET_RELATED_PRODUCTS_REQUEST,
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
            type: constants.GET_RELATED_PRODUCTS_SUCCESS,
            payload: {
                products: [1, 2],
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
            type: constants.GET_RELATED_PRODUCTS_FAILURE,
            payload: {
                error,
            },
        })).toStrictEqual(expectedState)
    })
})
