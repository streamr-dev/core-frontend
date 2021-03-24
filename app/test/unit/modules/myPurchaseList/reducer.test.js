import reducer, { initialState } from '$mp/modules/myPurchaseList/reducer'
import * as constants from '$mp/modules/myPurchaseList/constants'

describe('myPurchaseList - reducer', () => {
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
            type: constants.GET_MY_PURCHASES_REQUEST,
            payload: {},
        })).toStrictEqual(expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ...initialState,
            subscriptions: [1, 2, 3],
            fetching: false,
            error: null,
        }
        const reducerState = reducer(undefined, {
            type: constants.GET_MY_PURCHASES_SUCCESS,
            payload: {
                subscriptions: [1, 2, 3],
            },
        })
        expect(reducerState).toStrictEqual(expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ...initialState,
            subscriptions: [],
            fetching: false,
            error,
        }

        const reducerState = reducer(undefined, {
            type: constants.GET_MY_PURCHASES_FAILURE,
            payload: {
                error,
            },
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
})
