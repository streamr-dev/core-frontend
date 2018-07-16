// @flow

import type { ErrorInUi } from '../../flowtype/common-types'
import type { Canvas } from '../../flowtype/canvas-types'
import { get } from '../../utils/api'

const apiUrl = `${process.env.STREAMR_API_URL}/canvases`

export const GET_CANVASES_REQUEST = 'GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'GET_CANVASES_FAILURE'

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
