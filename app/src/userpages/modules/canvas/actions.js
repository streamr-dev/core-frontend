// @flow

import { I18n } from 'react-redux-i18n'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '../../flowtype/common-types'
import type { Canvas, CanvasId } from '../../flowtype/canvas-types'
import { canvasSchema, canvasesSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import * as api from '$shared/utils/api'

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

export const getCanvases = (filter?: Filter) => (dispatch: Function) => {
    dispatch(getCanvasesRequest())

    const params = getParamsForFilter(filter, {
        adhoc: false,
        sortBy: 'lastUpdated',
    })

    return api.get(apiUrl, { params })
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
    return api.get(`${apiUrl}/${id}`)
        .then(handleEntities(canvasSchema, dispatch))
        .then((data) => dispatch(getCanvasSuccess(data)))
        .catch((e) => {
            dispatch(getCanvasFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
            throw e
        })
}

export const deleteCanvas = (id: CanvasId) => async (dispatch: Function): Promise<void> => {
    dispatch(deleteCanvasRequest(id))
    try {
        const deleteCanvas = await api.del(`${apiUrl}/${id}`)
        dispatch(deleteCanvasSuccess(id))
        Notification.push({
            title: I18n.t('userpages.canvases.deleteCanvas'),
            icon: NotificationIcon.CHECKMARK,
        })
        return deleteCanvas
    } catch (e) {
        dispatch(deleteCanvasFailure(e))
        Notification.push({
            title: e.message,
            icon: NotificationIcon.ERROR,
        })
    }
}

export const openCanvas = (id: CanvasId) => (dispatch: Function) => {
    dispatch(openCanvasAction(id))
    return dispatch(getCanvas(id))
}
