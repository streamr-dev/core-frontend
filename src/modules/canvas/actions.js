// @flow

import type { ErrorInUi } from '../../flowtype/common-types'
import type { Canvas } from '../../flowtype/canvas-types'
import { get } from '../../utils/api'

export const GET_RUNNING_CANVASES_REQUEST = 'GET_RUNNING_CANVASES_REQUEST'
export const GET_RUNNING_CANVASES_SUCCESS = 'GET_RUNNING_CANVASES_SUCCESS'
export const GET_RUNNING_CANVASES_FAILURE = 'GET_RUNNING_CANVASES_FAILURE'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

const getCanvasesRequest = () => ({
    type: GET_RUNNING_CANVASES_REQUEST,
})

const getCanvasesSuccess = (canvases: Array<Canvas>) => ({
    type: GET_RUNNING_CANVASES_SUCCESS,
    canvases,
})

const getCanvasesFailure = (error: ErrorInUi) => ({
    type: GET_RUNNING_CANVASES_FAILURE,
    error,
})

export const getRunningCanvases = () => (dispatch: Function) => {
    dispatch(getCanvasesRequest())
    return get(apiUrl, {
        params: {
            state: 'RUNNING',
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
