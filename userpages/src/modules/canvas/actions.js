// @flow

import { error as errorNotification } from 'react-notification-system-redux'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Canvas } from '../../flowtype/canvas-types'
import { get } from '../../utils/api'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

export const GET_CANVASES_REQUEST = 'GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'GET_CANVASES_FAILURE'
export const GET_CANVAS_REQUEST = 'GET_CANVAS_REQUEST'
export const GET_CANVAS_SUCCESS = 'GET_CANVAS_SUCCESS'
export const GET_CANVAS_FAILURE = 'GET_CANVAS_FAILURE'

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

export const getCanvases = () => (dispatch: Function) => {
    dispatch(getCanvasesRequest())
    return get(apiUrl, {
        params: {
            adhoc: false,
            sort: 'dateCreated',
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
