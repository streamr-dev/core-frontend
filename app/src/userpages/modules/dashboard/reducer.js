// @flow

import type { DashboardState } from '$userpages/flowtype/states/dashboard-state'
import type { Action as DashboardAction } from '$userpages/flowtype/actions/dashboard-actions'

import {
    GET_DASHBOARDS_REQUEST,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,
    GET_DASHBOARD_REQUEST,
    GET_DASHBOARD_SUCCESS,
    GET_DASHBOARD_FAILURE,
    UPDATE_AND_SAVE_DASHBOARD_REQUEST,
    UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
    UPDATE_AND_SAVE_DASHBOARD_FAILURE,
    DELETE_DASHBOARD_REQUEST,
    DELETE_DASHBOARD_SUCCESS,
    DELETE_DASHBOARD_FAILURE,
    GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
    GET_MY_DASHBOARD_PERMISSIONS_SUCCESS,
    GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
    OPEN_DASHBOARD,
    CHANGE_DASHBOARD_ID,
} from './actions'

const initialState = {
    ids: [],
    openDashboard: {
        id: null,
        isFullScreen: false,
    },
    error: null,
    fetching: false,
}

const dashboard = function dashboard(state: DashboardState = initialState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case OPEN_DASHBOARD:
            return {
                ...state,
                openDashboard: {
                    ...state.openDashboard,
                    id: action.id,
                },
            }

        case GET_DASHBOARDS_REQUEST:
        case GET_DASHBOARD_REQUEST:
        case UPDATE_AND_SAVE_DASHBOARD_REQUEST:
        case DELETE_DASHBOARD_REQUEST:
        case GET_MY_DASHBOARD_PERMISSIONS_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case GET_DASHBOARDS_SUCCESS:
            return {
                ...state,
                ids: action.dashboards,
                fetching: false,
                error: null,
            }

        case GET_DASHBOARD_SUCCESS:
        case UPDATE_AND_SAVE_DASHBOARD_SUCCESS: {
            return {
                ...state,
                error: null,
                fetching: false,
            }
        }

        case DELETE_DASHBOARD_SUCCESS: {
            const removedId = action.id
            return {
                ...state,
                ids: state.ids.filter((id) => (id !== removedId)),
                error: null,
                fetching: false,
            }
        }

        case GET_MY_DASHBOARD_PERMISSIONS_SUCCESS: {
            return {
                ...state,
                error: null,
                fetching: false,
            }
        }

        case GET_DASHBOARDS_FAILURE:
        case GET_DASHBOARD_FAILURE:
        case UPDATE_AND_SAVE_DASHBOARD_FAILURE:
        case DELETE_DASHBOARD_FAILURE:
        case GET_MY_DASHBOARD_PERMISSIONS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }

        case CHANGE_DASHBOARD_ID: {
            const { oldId, newId } = action
            return {
                ...state,
                ids: [
                    ...state.ids.filter((id) => (id !== oldId)),
                    newId,
                ],
                openDashboard: {
                    ...state.openDashboard,
                    id: state.openDashboard.id === oldId ? newId : state.openDashboard.id,
                },
            }
        }

        default:
            return state
    }
}

export default dashboard
