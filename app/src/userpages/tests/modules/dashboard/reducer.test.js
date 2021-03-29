import reducer from '../../../modules/dashboard/reducer'
import * as actions from '../../../modules/dashboard/actions'

describe('Dashboard reducer', () => {
    const initialState = {
        ids: [],
        error: null,
        fetching: false,
    }

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toStrictEqual(initialState)
    })

    describe('GET_DASHBOARDS', () => {
        it('should handle GET_DASHBOARDS_REQUEST', () => {
            expect(reducer(initialState, {
                type: actions.GET_DASHBOARDS_REQUEST,
            })).toStrictEqual({
                ...initialState,
                fetching: true,
            })
        })
        it('should handle GET_DASHBOARDS_SUCCESS', () => {
            expect(reducer({
                ...initialState,
            }, {
                type: actions.GET_DASHBOARDS_SUCCESS,
                dashboards: ['test', 'test2'],
            })).toStrictEqual({
                ...initialState,
                ids: ['test', 'test2'],
            })
        })
        it('should handle GET_DASHBOARDS_FAILURE', () => {
            expect(reducer(initialState, {
                type: actions.GET_DASHBOARDS_FAILURE,
                error: new Error('test'),
            })).toStrictEqual({
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })
})
