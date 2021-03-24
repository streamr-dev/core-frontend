import reducer, { initialState } from '$mp/modules/myProductList/reducer'
import * as constants from '$mp/modules/myProductList/constants'

describe('myProductList - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ...initialState,
            fetching: true,
            error: null,
        }

        expect(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_REQUEST,
        })).toStrictEqual(expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ...initialState,
            ids: [1337, 1338],
            fetching: false,
        }

        expect(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_SUCCESS,
            payload: {
                products: [1337, 1338],
            },
        })).toStrictEqual(expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test Error')

        const expectedState = {
            ...initialState,
            fetching: false,
            error,
        }

        expect(reducer(undefined, {
            type: constants.GET_MY_PRODUCTS_FAILURE,
            payload: {
                error,
            },
        })).toStrictEqual(expectedState)
    })
})

