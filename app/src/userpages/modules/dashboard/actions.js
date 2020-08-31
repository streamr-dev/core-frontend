import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { dashboardsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import { removeResourcePermissions } from '$userpages/modules/permission/actions'

import * as services from './services'

export const GET_DASHBOARDS_REQUEST = 'userpages/dashboard/GET_DASHBOARDS_REQUEST'
export const GET_DASHBOARDS_SUCCESS = 'userpages/dashboard/GET_DASHBOARDS_SUCCESS'
export const GET_DASHBOARDS_FAILURE = 'userpages/dashboard/GET_DASHBOARDS_FAILURE'
export const DELETE_DASHBOARD_REQUEST = 'userpages/dashboard/DELETE_DASHBOARD_REQUEST'
export const DELETE_DASHBOARD_SUCCESS = 'userpages/dashboard/DELETE_DASHBOARD_SUCCESS'
export const DELETE_DASHBOARD_FAILURE = 'userpages/dashboard/DELETE_DASHBOARD_FAILURE'

const getDashboardsRequest = () => ({
    type: GET_DASHBOARDS_REQUEST,
})

const getDashboardsSuccess = (dashboards) => ({
    type: GET_DASHBOARDS_SUCCESS,
    dashboards,
})

const getDashboardsFailure = (error) => ({
    type: GET_DASHBOARDS_FAILURE,
    error,
})

const deleteDashboardRequest = (id) => ({
    type: DELETE_DASHBOARD_REQUEST,
    id,
})

const deleteDashboardSuccess = (id) => ({
    type: DELETE_DASHBOARD_SUCCESS,
    id,
})

const deleteDashboardFailure = (error) => ({
    type: DELETE_DASHBOARD_FAILURE,
    error,
})

export const getDashboards = (filter) => (dispatch) => {
    dispatch(getDashboardsRequest())

    const params = getParamsForFilter(filter, {
        sortBy: 'name',
    })

    return services.getDashboards(params)
        .then(handleEntities(dashboardsSchema, dispatch))
        .then((data) => {
            dispatch(getDashboardsSuccess(data))
        })
        .catch((e) => {
            dispatch(getDashboardsFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
            throw e
        })
}

export const deleteDashboard = (id) => async (dispatch) => {
    dispatch(deleteDashboardRequest(id))
    try {
        const deleteDashboard = await services.deleteDashboard(id)
        dispatch(deleteDashboardSuccess(id))
        return deleteDashboard
    } catch (e) {
        dispatch(deleteDashboardFailure(e))
        throw e
    }
}

export const removeDashboard = (id, resourcePermissions) => async (dispatch) => {
    dispatch(deleteDashboardRequest(id))
    try {
        const deleteDashboard = await dispatch(removeResourcePermissions('DASHBOARD', id, resourcePermissions))
        dispatch(deleteDashboardSuccess(id))
        return deleteDashboard
    } catch (e) {
        dispatch(deleteDashboardFailure(e))
        throw e
    }
}

export const deleteOrRemoveDashboard = (id) => async (dispatch) => {
    const resourcePermissions = await getResourcePermissions({
        resourceType: 'DASHBOARD',
        resourceId: id,
        id: 'me',
    })

    const permissionIds = (resourcePermissions || []).reduce((result, { id, operation }) => ({
        ...result,
        [id]: operation,
    }), {})

    if (Object.values(permissionIds).includes('dashboard_delete')) {
        return dispatch(deleteDashboard(id))
    }

    return dispatch(removeDashboard(id, Object.keys(permissionIds)))
}
