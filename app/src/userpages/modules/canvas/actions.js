// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '../../flowtype/common-types'
import type { Canvas, CanvasId } from '../../flowtype/canvas-types'
import { canvasesSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'
import * as api from '$shared/utils/api'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

export const GET_CANVASES_REQUEST = 'userpages/canvas/GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'userpages/canvas/GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'userpages/canvas/GET_CANVASES_FAILURE'
export const DELETE_CANVAS_REQUEST = 'userpages/canvas/DELETE_CANVAS_REQUEST'
export const DELETE_CANVAS_SUCCESS = 'userpages/canvas/DELETE_CANVAS_SUCCESS'
export const DELETE_CANVAS_FAILURE = 'userpages/canvas/DELETE_CANVAS_FAILURE'

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

export const getCanvases = (filter?: Filter) => (dispatch: Function) => {
    dispatch(getCanvasesRequest())

    const params = getParamsForFilter(filter, {
        adhoc: false,
        sortBy: 'lastUpdated',
    })

    return api.get({
        url: apiUrl,
        options: { params },
    })
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

export const deleteCanvas = (id: CanvasId) => async (dispatch: Function): Promise<void> => {
    dispatch(deleteCanvasRequest(id))
    try {
        const deleteCanvas = await api.del({
            url: `${apiUrl}/${id}`,
        })
        dispatch(deleteCanvasSuccess(id))
        return deleteCanvas
    } catch (e) {
        dispatch(deleteCanvasFailure(e))
        throw e
    }
}
