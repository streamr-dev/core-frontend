import {
    GET_CANVASES_REQUEST,
    GET_CANVASES_SUCCESS,
    GET_CANVASES_FAILURE,
    DELETE_CANVAS_REQUEST,
    DELETE_CANVAS_SUCCESS,
    DELETE_CANVAS_FAILURE,
} from './actions'

const initialState = {
    ids: [],
    error: null,
    fetching: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CANVASES_REQUEST:
        case DELETE_CANVAS_REQUEST:
            return {
                ...state,
                fetching: true,
            }
        case GET_CANVASES_SUCCESS:
            return {
                ...state,
                ids: action.canvases,
                fetching: false,
                error: null,
            }
        case GET_CANVASES_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }
        case DELETE_CANVAS_SUCCESS:
            return {
                ...state,
                ids: state.ids.filter((id) => id !== action.id),
                fetching: false,
                error: null,
            }
        case DELETE_CANVAS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }
        default:
            return state
    }
}
