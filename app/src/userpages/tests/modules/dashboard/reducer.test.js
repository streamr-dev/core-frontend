import assert from 'assert-diff'
import reducer from '../../../modules/dashboard/reducer'
import * as actions from '../../../modules/dashboard/actions'

describe('Dashboard reducer', () => {
    const initialState = {
        ids: [],
        openDashboard: {
            id: null,
            isFullScreen: false,
        },
        error: null,
        fetching: false,
    }

    it('should return the initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    it('should handle OPEN_DASHBOARD', () => {
        assert.deepStrictEqual(reducer(initialState, {
            type: actions.OPEN_DASHBOARD,
            id: 'test',
        }), {
            ...initialState,
            openDashboard: {
                id: 'test',
                isFullScreen: false,
            },
        })
    })

    it('should handle CHANGE_DASHBOARD_ID', () => {
        assert.deepStrictEqual(reducer({
            ...initialState,
            ids: ['test'],
        }, {
            type: actions.CHANGE_DASHBOARD_ID,
            oldId: 'test',
            newId: 'test2',
        }), {
            ...initialState,
            ids: ['test2'],
        })
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

    describe('GET_DASHBOARD', () => {
        it('should handle GET_DASHBOARD_REQUEST', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_DASHBOARD_REQUEST,
            }), {
                ...initialState,
                fetching: true,
            })
        })
        it('should handle GET_DASHBOARD_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                ...initialState,
            }, {
                type: actions.GET_DASHBOARD_SUCCESS,
            }), {
                ...initialState,
                openDashboard: {
                    id: null,
                    isFullScreen: false,
                },
                error: null,
                fetching: false,
            })
        })
        it('should handle GET_DASHBOARD_FAILURE', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_DASHBOARD_FAILURE,
                error: new Error('test'),
            }), {
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })

    describe('UPDATE_AND_SAVE_DASHBOARD', () => {
        it('should handle UPDATE_AND_SAVE_DASHBOARD_REQUEST', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_REQUEST,
            }), {
                ...initialState,
                fetching: true,
            })
        })
        it('should handle UPDATE_AND_SAVE_DASHBOARD_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                ...initialState,
            }, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
                dashboard: {
                    id: 'test2',
                },
            }), {
                ...initialState,
                openDashboard: {
                    id: null,
                    isFullScreen: false,
                },
                error: null,
                fetching: false,
            })
        })
        it('should handle UPDATE_AND_SAVE_DASHBOARD_FAILURE', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.UPDATE_AND_SAVE_DASHBOARD_FAILURE,
                error: new Error('test'),
            }), {
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })

    describe('DELETE_DASHBOARD', () => {
        it('should handle DELETE_DASHBOARD_REQUEST', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.DELETE_DASHBOARD_REQUEST,
            }), {
                ...initialState,
                fetching: true,
            })
        })
        it('should handle DELETE_DASHBOARD_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                ...initialState,
                ids: ['test', 'test2'],
            }, {
                type: actions.DELETE_DASHBOARD_SUCCESS,
                id: 'test',
            }), {
                ...initialState,
                ids: ['test2'],
                error: null,
                fetching: false,
            })
        })
        it('should handle DELETE_DASHBOARD_FAILURE', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.DELETE_DASHBOARD_FAILURE,
                error: new Error('test'),
            }), {
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })

    describe('GET_MY_DASHBOARD_PERMISSIONS', () => {
        it('should handle GET_MY_DASHBOARD_PERMISSIONS_REQUEST', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
            }), {
                ...initialState,
                fetching: true,
            })
        })
        it('should handle GET_MY_DASHBOARD_PERMISSIONS_SUCCESS', () => {
            assert.deepStrictEqual(reducer({
                ...initialState,
            }, {
                type: actions.GET_MY_DASHBOARD_PERMISSIONS_SUCCESS,
                id: 'test',
                permissions: ['test', 'test2'],
            }), {
                ...initialState,
                error: null,
                fetching: false,
            })
        })
        it('should handle GET_MY_DASHBOARD_PERMISSIONS_FAILURE', () => {
            assert.deepStrictEqual(reducer(initialState, {
                type: actions.GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
                error: new Error('test'),
            }), {
                ...initialState,
                fetching: false,
                error: new Error('test'),
            })
        })
    })
})
