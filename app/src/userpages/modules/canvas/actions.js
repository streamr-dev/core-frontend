// @flow

import { error as errorNotification } from 'react-notification-system-redux'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '../../flowtype/common-types'
import type { Canvas, CanvasId } from '../../flowtype/canvas-types'
import type { StoreState } from '../../flowtype/states/store-state'
import { selectFilter } from './selectors'
import { get, del } from '$shared/utils/api'
import { canvasSchema, canvasesSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

export const GET_CANVASES_REQUEST = 'userpages/canvas/GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'userpages/canvas/GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'userpages/canvas/GET_CANVASES_FAILURE'
export const GET_CANVAS_REQUEST = 'userpages/canvas/GET_CANVAS_REQUEST'
export const GET_CANVAS_SUCCESS = 'userpages/canvas/GET_CANVAS_SUCCESS'
export const GET_CANVAS_FAILURE = 'userpages/canvas/GET_CANVAS_FAILURE'
export const DELETE_CANVAS_REQUEST = 'userpages/canvas/DELETE_CANVAS_REQUEST'
export const DELETE_CANVAS_SUCCESS = 'userpages/canvas/DELETE_CANVAS_SUCCESS'
export const DELETE_CANVAS_FAILURE = 'userpages/canvas/DELETE_CANVAS_FAILURE'
export const OPEN_CANVAS = 'userpages/canvas/OPEN_CANVAS'
export const UPDATE_FILTER = 'userpages/canvas/UPDATE_FILTER'

const getCanvasesRequest = () => ({
    type: GET_CANVASES_REQUEST,
})

const getCanvasesSuccess = (canvases: Array<Canvas>) => ({
    type: GET_CANVASES_SUCCESS,
    canvases,
})

const getCanvasesFailure = (error: ErrorInUi) => ({
    type: GET_CANVASES_FAILURE,
    error,
})

const getCanvasRequest = (id: CanvasId) => ({
    type: GET_CANVAS_REQUEST,
    id,
})

const getCanvasSuccess = (canvas: Canvas) => ({
    type: GET_CANVAS_SUCCESS,
    canvas,
})

const getCanvasFailure = (error: ErrorInUi) => ({
    type: GET_CANVAS_FAILURE,
    error,
})

const deleteCanvasRequest = (id: CanvasId) => ({
    type: DELETE_CANVAS_REQUEST,
    id,
})

const deleteCanvasSuccess = (id: CanvasId) => ({
    type: DELETE_CANVAS_SUCCESS,
    id,
})

const deleteCanvasFailure = (error: ErrorInUi) => ({
    type: DELETE_CANVAS_FAILURE,
    error,
})

const openCanvasAction = (id: CanvasId) => ({
    type: OPEN_CANVAS,
    id,
})

const updateFilterAction = (filter: Filter) => ({
    type: UPDATE_FILTER,
    filter,
})

export const getCanvases = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getCanvasesRequest())

    const filter = selectFilter(getState())
    const params = getParamsForFilter(filter, {
        sortBy: 'lastUpdated',
    })

    return get(apiUrl, { params })
        .then((data) => (
            // filter out adhoc canvases which should be filtered by server
            data.filter(({ adhoc }) => !adhoc)
        ))
        .then(handleEntities(canvasesSchema, dispatch))
        .then((data) => {
            dispatch(getCanvasesSuccess(data))
        })
        .catch((e) => {
            dispatch(getCanvasesFailure(e))
            throw e
        })
}

export const getCanvas = (id: CanvasId) => (dispatch: Function) => {
    dispatch(getCanvasRequest(id))
    return get(`${apiUrl}/${id}`)
        .then(handleEntities(canvasSchema, dispatch))
        .then((data) => dispatch(getCanvasSuccess(data)))
        .catch((e) => {
            dispatch(getCanvasFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const deleteCanvas = (id: CanvasId) => (dispatch: Function) => {
    dispatch(deleteCanvasRequest(id))
    return del(`${apiUrl}/${id}`)
        .then(() => dispatch(deleteCanvasSuccess(id)))
        .catch((e) => {
            dispatch(deleteCanvasFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const openCanvas = (id: CanvasId) => (dispatch: Function) => {
    dispatch(openCanvasAction(id))
    return dispatch(getCanvas(id))
}

export const updateFilter = (filter: Filter) => (dispatch: Function) => (
    dispatch(updateFilterAction(filter))
)
