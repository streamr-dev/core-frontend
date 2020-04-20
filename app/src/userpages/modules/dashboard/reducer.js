// @flow

import type { DashboardState } from '$userpages/flowtype/states/dashboard-state'
import type { Action as DashboardAction } from '$userpages/flowtype/actions/dashboard-actions'

import {
    GET_DASHBOARDS_REQUEST,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,
} from './actions'

const initialState = {
    ids: [],
    error: null,
    fetching: false,
}

const dashboard = function dashboard(state: DashboardState = initialState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case GET_DASHBOARDS_REQUEST:
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

        case GET_DASHBOARDS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }

        default:
            return state
    }
}

export default dashboard
