// @flow

import type { CanvasState } from '../../flowtype/states/canvas-state'
import type { CanvasAction } from '../../flowtype/actions/canvas-actions'

import {
    GET_CANVASES_REQUEST,
    GET_CANVASES_SUCCESS,
    GET_CANVASES_FAILURE,
    GET_CANVAS_REQUEST,
    GET_CANVAS_SUCCESS,
    GET_CANVAS_FAILURE,
    DELETE_CANVAS_REQUEST,
    DELETE_CANVAS_SUCCESS,
    DELETE_CANVAS_FAILURE,
    OPEN_CANVAS,
} from './actions'

const initialState = {
    ids: [],
    openCanvasId: null,
    error: null,
    fetching: false,
}

export default function (state: CanvasState = initialState, action: CanvasAction): CanvasState {
    switch (action.type) {
        case GET_CANVAS_REQUEST:
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
        case GET_CANVAS_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: null,
            }
        case GET_CANVAS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }
        case DELETE_CANVAS_SUCCESS:
            return {
                ...state,
                // $FlowFixMe
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
        case OPEN_CANVAS:
            return {
                ...state,
                openCanvasId: action.id,
            }
        default:
            return state
    }
}
