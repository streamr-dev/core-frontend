import { canvasesSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'
import { removeResourcePermissions } from '$userpages/modules/permission/actions'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import * as api from '$shared/utils/api'
import routes from '$routes'

export const GET_CANVASES_REQUEST = 'userpages/canvas/GET_CANVASES_REQUEST'
export const GET_CANVASES_SUCCESS = 'userpages/canvas/GET_CANVASES_SUCCESS'
export const GET_CANVASES_FAILURE = 'userpages/canvas/GET_CANVASES_FAILURE'
export const DELETE_CANVAS_REQUEST = 'userpages/canvas/DELETE_CANVAS_REQUEST'
export const DELETE_CANVAS_SUCCESS = 'userpages/canvas/DELETE_CANVAS_SUCCESS'
export const DELETE_CANVAS_FAILURE = 'userpages/canvas/DELETE_CANVAS_FAILURE'

const getCanvasesRequest = () => ({
    type: GET_CANVASES_REQUEST,
})

const getCanvasesSuccess = (canvases) => ({
    type: GET_CANVASES_SUCCESS,
    canvases,
})

const getCanvasesFailure = (error) => ({
    type: GET_CANVASES_FAILURE,
    error,
})

const deleteCanvasRequest = (id) => ({
    type: DELETE_CANVAS_REQUEST,
    id,
})

const deleteCanvasSuccess = (id) => ({
    type: DELETE_CANVAS_SUCCESS,
    id,
})

const deleteCanvasFailure = (error) => ({
    type: DELETE_CANVAS_FAILURE,
    error,
})

export const getCanvases = (filter) => (dispatch) => {
    dispatch(getCanvasesRequest())

    const params = getParamsForFilter(filter, {
        adhoc: false,
        sortBy: 'lastUpdated',
    })

    return api.get({
        url: routes.api.canvases.index(),
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

export const deleteCanvas = (id) => async (dispatch) => {
    dispatch(deleteCanvasRequest(id))
    try {
        const deleteCanvas = await api.del({
            url: routes.api.canvases.show({
                id,
            }),
        })
        dispatch(deleteCanvasSuccess(id))
        return deleteCanvas
    } catch (e) {
        dispatch(deleteCanvasFailure(e))
        throw e
    }
}

export const removeCanvas = (id, resourcePermissions) => async (dispatch) => {
    dispatch(deleteCanvasRequest(id))
    try {
        const removeCanvas = await dispatch(removeResourcePermissions('CANVAS', id, resourcePermissions))
        dispatch(deleteCanvasSuccess(id))
        return removeCanvas
    } catch (e) {
        dispatch(deleteCanvasFailure(e))
        throw e
    }
}

export const deleteOrRemoveCanvas = (id) => async (dispatch) => {
    const resourcePermissions = await getResourcePermissions({
        resourceType: 'CANVAS',
        resourceId: id,
        id: 'me',
    })

    const permissionIds = (resourcePermissions || []).reduce((result, { id, operation }) => ({
        ...result,
        [id]: operation,
    }), {})

    if (Object.values(permissionIds).includes('canvas_delete')) {
        return dispatch(deleteCanvas(id))
    }

    return dispatch(removeCanvas(id, Object.keys(permissionIds)))
}
