// @flow

import { error as errorNotification } from 'react-notification-system-redux'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Canvas } from '../../flowtype/canvas-types'
import { get, del } from '$shared/utils/api'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

export const GET_CANVASES_REQUEST = 'GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'GET_CANVASES_FAILURE'
export const GET_CANVAS_REQUEST = 'GET_CANVAS_REQUEST'
export const GET_CANVAS_SUCCESS = 'GET_CANVAS_SUCCESS'
export const GET_CANVAS_FAILURE = 'GET_CANVAS_FAILURE'
export const DELETE_CANVAS_REQUEST = 'DELETE_CANVAS_REQUEST'
export const DELETE_CANVAS_SUCCESS = 'DELETE_CANVAS_SUCCESS'
export const DELETE_CANVAS_FAILURE = 'DELETE_CANVAS_FAILURE'

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

const getCanvasRequest = (id: $ElementType<Canvas, 'id'>) => ({
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

const deleteCanvasRequest = (id: $ElementType<Canvas, 'id'>) => ({
    type: DELETE_CANVAS_REQUEST,
    id,
})

const deleteCanvasSuccess = (id: $ElementType<Canvas, 'id'>) => ({
    type: DELETE_CANVAS_SUCCESS,
    id,
})

const deleteCanvasFailure = (error: ErrorInUi) => ({
    type: DELETE_CANVAS_FAILURE,
    error,
})

export const getCanvases = () => (dispatch: Function) => {
    dispatch(getCanvasesRequest())
    return get(apiUrl, {
        params: {
            adhoc: false,
            sortBy: 'lastUpdated',
            order: 'desc',
        },
    })
        .then((data) => {
            dispatch(getCanvasesSuccess(data))
        })
        .catch((e) => {
            dispatch(getCanvasesFailure(e))
            throw e
        })
}

export const getCanvas = (id: $ElementType<Canvas, 'id'>) => (dispatch: Function) => {
    dispatch(getCanvasRequest(id))
    return get(`${apiUrl}/${id}`)
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

export const deleteCanvas = (id: $ElementType<Canvas, 'id'>) => (dispatch: Function) => {
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
