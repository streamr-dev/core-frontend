// @flow

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '../../flowtype/common-types'
import type { DashboardId, DashboardIdList, Dashboard, DashboardItem } from '../../flowtype/dashboard-types'
import { dashboardsSchema, dashboardSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { getParamsForFilter } from '$userpages/utils/filters'

import * as services from './services'

export const GET_DASHBOARDS_REQUEST = 'userpages/dashboard/GET_DASHBOARDS_REQUEST'
export const GET_DASHBOARDS_SUCCESS = 'userpages/dashboard/GET_DASHBOARDS_SUCCESS'
export const GET_DASHBOARDS_FAILURE = 'userpages/dashboard/GET_DASHBOARDS_FAILURE'

export const updateDashboard = (dashboard: Dashboard) => (dispatch: Function) => {
    if (dashboard && dashboard.id) {
        handleEntities(dashboardSchema, dispatch)({
            ...dashboard,
            saved: false,
        })
    }
}

export const addDashboardItem = (dashboard: Dashboard, item: DashboardItem) => updateDashboard({
    ...dashboard,
    items: [
        ...dashboard.items,
        item,
    ],
})

export const updateDashboardItem = (dashboard: Dashboard, item: DashboardItem) => updateDashboard({
    ...dashboard,
    items: [
        ...(dashboard.items.filter((it) => it.canvas !== item.canvas || it.module !== item.module)),
        item,
    ],
})

export const removeDashboardItem = (dashboard: Dashboard, item: DashboardItem) => updateDashboard({
    ...dashboard,
    items: dashboard.items.filter((it) => it.canvas !== item.canvas || it.module !== item.module),
})

export const newDashboard = (id: DashboardId) => (dispatch: Function) => {
    handleEntities(dashboardSchema, dispatch)({
        id,
        name: 'Untitled Dashboard',
        items: [],
        layout: {},
        editingLocked: false,
        new: true,
        saved: true,
    })
}

export const lockDashboardEditing = (id: DashboardId) => (dispatch: Function) => {
    handleEntities(dashboardSchema, dispatch)({
        id,
        editingLocked: true,
    })
}

export const unlockDashboardEditing = (id: DashboardId) => (dispatch: Function) => {
    handleEntities(dashboardSchema, dispatch)({
        id,
        editingLocked: false,
    })
}

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
