// @flow

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '../../flowtype/common-types'
import type { DashboardId, DashboardIdList } from '../../flowtype/dashboard-types'
import { dashboardsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'

import * as services from './services'

export const GET_DASHBOARDS_REQUEST = 'userpages/dashboard/GET_DASHBOARDS_REQUEST'
export const GET_DASHBOARDS_SUCCESS = 'userpages/dashboard/GET_DASHBOARDS_SUCCESS'
export const GET_DASHBOARDS_FAILURE = 'userpages/dashboard/GET_DASHBOARDS_FAILURE'
export const DELETE_DASHBOARD_REQUEST = 'userpages/canvas/DELETE_DASHBOARD_REQUEST'
export const DELETE_DASHBOARD_SUCCESS = 'userpages/canvas/DELETE_DASHBOARD_SUCCESS'
export const DELETE_DASHBOARD_FAILURE = 'userpages/canvas/DELETE_DASHBOARD_FAILURE'

const getDashboardsRequest = () => ({
    type: GET_DASHBOARDS_REQUEST,
})

const getDashboardsSuccess = (dashboards: DashboardIdList) => ({
    type: GET_DASHBOARDS_SUCCESS,
    dashboards,
})

const getDashboardsFailure = (error: ErrorInUi) => ({
    type: GET_DASHBOARDS_FAILURE,
    error,
})

const deleteDashboardRequest = (id: DashboardId) => ({
    type: DELETE_DASHBOARD_REQUEST,
    id,
})

const deleteDashboardSuccess = (id: DashboardId) => ({
    type: DELETE_DASHBOARD_SUCCESS,
    id,
})

const deleteDashboardFailure = (error: ErrorInUi) => ({
    type: DELETE_DASHBOARD_FAILURE,
    error,
})

export const getDashboards = (filter?: Filter) => (dispatch: Function) => {
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

export const deleteDashboard = (id: DashboardId) => async (dispatch: Function): Promise<void> => {
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
