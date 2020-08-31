import {
    GET_DASHBOARDS_REQUEST,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,
    DELETE_DASHBOARD_REQUEST,
    DELETE_DASHBOARD_SUCCESS,
    DELETE_DASHBOARD_FAILURE,
} from './actions'

const initialState = {
    ids: [],
    error: null,
    fetching: false,
}

const dashboard = function dashboard(state = initialState, action) {
    switch (action.type) {
        case GET_DASHBOARDS_REQUEST:
        case DELETE_DASHBOARD_REQUEST:
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

        case DELETE_DASHBOARD_SUCCESS:
            return {
                ...state,
                ids: state.ids.filter((id) => id !== action.id),
                fetching: false,
                error: null,
            }
        case DELETE_DASHBOARD_FAILURE:
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
