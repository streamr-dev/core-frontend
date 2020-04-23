import assert from 'assert-diff'
import reducer from '../../../modules/dashboard/reducer'
import * as actions from '../../../modules/dashboard/actions'

describe('Dashboard reducer', () => {
    const initialState = {
        ids: [],
        error: null,
        fetching: false,
    }

    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('GET_DASHBOARDS', () => {
        it('should handle GET_DASHBOARDS_REQUEST', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_DASHBOARDS_REQUEST,
            }), {
                ...initialState,
                fetching: true,
            })
        })
        it('should handle GET_DASHBOARDS_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                ...initialState,
            }, {
                type: actions.GET_DASHBOARDS_SUCCESS,
                dashboards: ['test', 'test2'],
            }), {
                ...initialState,
                ids: ['test', 'test2'],
            })
        })
        it('should handle GET_DASHBOARDS_FAILURE', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_DASHBOARDS_FAILURE,
                error: new Error('test'),
            }), {
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })
})
