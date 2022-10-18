import reducer, { initialState } from '$mp/modules/productList/reducer'
import * as constants from '$mp/modules/productList/constants'
import { ProductListState } from '$mp/types/store-state'
describe('productList - reducer', () => {
    it('has initial state', () => {
        expect(reducer(undefined, {type: '', payload: {}})).toStrictEqual(initialState)
    })
    it('handles request', () => {
        const expectedState = { ...initialState, fetching: true }
        expect(
            reducer(undefined, {
                type: constants.GET_PRODUCTS_REQUEST,
                payload: {},
            }),
        ).toStrictEqual(expectedState)
    })
    it('handles success', () => {
        const expectedState = {
            ...initialState,
            ids: [1, 2, 3],
            fetching: false,
            offset: 3,
            error: undefined,
            hasMoreSearchResults: false,
        }
        const reducerState = reducer(undefined, {
            type: constants.GET_PRODUCTS_SUCCESS,
            payload: {
                products: [1, 2, 3],
                hasMore: false,
            },
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
    it('handles failure', () => {
        const error = new Error('Test')
        const expectedState = { ...initialState, ids: [], fetching: false, error }
        const reducerState = reducer(undefined, {
            type: constants.GET_PRODUCTS_FAILURE,
            payload: {
                error,
            },
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
    it('updates filter', () => {
        const expectedState = {
            ...initialState,
            filter: { ...initialState.filter, search: 'foo' },
        }
        const reducerState = reducer(undefined, {
            type: constants.UPDATE_FILTER,
            payload: {
                filter: {
                    search: 'foo',
                },
            },
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
    it('clears filter', () => {
        const expectedState = { ...initialState }
        const mockState: ProductListState = { ...initialState, filter: {search: 'foo'} }
        const reducerState = reducer(mockState, {
            type: constants.CLEAR_FILTERS,
            payload: {}
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
    it('clears product list', () => {
        const expectedState = {
            ...initialState,
            error: undefined,
            ids: [],
            offset: 0,
            hasMoreSearchResults: undefined,
        }
        const mockState: ProductListState = {
            ...initialState,
            error: null,
            ids: ['1', '2', '3'],
            offset: 2,
            hasMoreSearchResults: true,
        }
        const reducerState = reducer(mockState, {
            type: constants.CLEAR_PRODUCT_LIST,
            payload: {}
        })
        expect(reducerState).toStrictEqual(expectedState)
    })
})
