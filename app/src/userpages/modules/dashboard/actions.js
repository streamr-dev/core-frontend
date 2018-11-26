// @flow

import _ from 'lodash'

import { success as successNotification, error as errorNotification } from 'react-notification-system-redux'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { DashboardId, DashboardIdList, Dashboard, DashboardItem, Layout, LayoutItem } from '../../flowtype/dashboard-types'
import { selectUserData } from '$shared/modules/user/selectors'
import { dashboardsSchema, dashboardSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { selectEntities } from '$shared/modules/entities/selectors'

import type { StoreState } from '$mp/flowtype/store-state'
import * as services from './services'
import { selectOpenDashboard } from './selectors'

export const OPEN_DASHBOARD = 'OPEN_DASHBOARD'

export const UPDATE_AND_SAVE_DASHBOARD_REQUEST = 'UPDATE_AND_SAVE_DASHBOARD_REQUEST'
export const UPDATE_AND_SAVE_DASHBOARD_SUCCESS = 'UPDATE_AND_SAVE_DASHBOARD_SUCCESS'
export const UPDATE_AND_SAVE_DASHBOARD_FAILURE = 'UPDATE_AND_SAVE_DASHBOARD_FAILURE'

export const GET_DASHBOARDS_REQUEST = 'GET_DASHBOARDS_REQUEST'
export const GET_DASHBOARDS_SUCCESS = 'GET_DASHBOARDS_SUCCESS'
export const GET_DASHBOARDS_FAILURE = 'GET_DASHBOARDS_FAILURE'

export const GET_DASHBOARD_REQUEST = 'GET_DASHBOARD_REQUEST'
export const GET_DASHBOARD_SUCCESS = 'GET_DASHBOARD_SUCCESS'
export const GET_DASHBOARD_FAILURE = 'GET_DASHBOARD_FAILURE'

export const DELETE_DASHBOARD_REQUEST = 'DELETE_DASHBOARD_REQUEST'
export const DELETE_DASHBOARD_SUCCESS = 'DELETE_DASHBOARD_SUCCESS'
export const DELETE_DASHBOARD_FAILURE = 'DELETE_DASHBOARD_FAILURE'

export const GET_MY_DASHBOARD_PERMISSIONS_REQUEST = 'GET_MY_DASHBOARD_PERMISSIONS_REQUEST'
export const GET_MY_DASHBOARD_PERMISSIONS_SUCCESS = 'GET_MY_DASHBOARD_PERMISSIONS_SUCCESS'
export const GET_MY_DASHBOARD_PERMISSIONS_FAILURE = 'GET_MY_DASHBOARD_PERMISSIONS_FAILURE'

export const CHANGE_DASHBOARD_ID = 'CHANGE_DASHBOARD_ID'

const dashboardConfig = require('../../components/DashboardPage/dashboardConfig')

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

export const updateDashboardLayout = (dashboardId: DashboardId, layout: Layout) => (dispatch: Function, getState: Function) => {
    const dashboard = selectOpenDashboard(getState())
    const normalizeLayoutItem = (item: LayoutItem) => ({
        i: item.i || 0,
        h: item.h || 0,
        isDraggable: item.isDraggable,
        isResizable: item.isResizable,
        maxH: item.maxH,
        maxW: item.maxW,
        minH: item.minH || 0,
        minW: item.minW || 0,
        moved: item.moved || false,
        static: item.static || false,
        w: item.w || 0,
        x: item.x || 0,
        y: item.y || 0,
    })

    const normalizeItemList = (itemList: ?Array<LayoutItem>) => (itemList ? _.chain(itemList)
        .sortBy('i')
        .map(normalizeLayoutItem)
        .value() : [])

    const normalizeLayout = (targetLayout: Layout) => dashboardConfig.layout.sizes.reduce((obj, size) => (
        Object.assign(obj, {
            [size]: (targetLayout && targetLayout[size]) ? normalizeItemList(targetLayout[size]) : [],
        })
    ), {})

    if (dashboard && !_.isEqual(normalizeLayout(layout), normalizeLayout(dashboard.layout))) {
        dispatch(updateDashboard({
            ...dashboard,
            layout,
        }))
    }
}

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

export const openDashboard = (id: DashboardId) => ({
    type: OPEN_DASHBOARD,
    id,
})

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

const changeDashboardId = (oldId: DashboardId, newId: DashboardId) => (dispatch: Function, getState: () => StoreState) => {
    const entities = selectEntities(getState())

    handleEntities(dashboardSchema, dispatch)({
        ...((!!entities.dashboards && entities.dashboards[oldId]) || {}),
        id: newId,
    })

    dispatch({
        type: CHANGE_DASHBOARD_ID,
        oldId,
        newId,
    })
}

const getDashboardsRequest = () => ({
    type: GET_DASHBOARDS_REQUEST,
})

const getDashboardRequest = (id: DashboardId) => ({
    type: GET_DASHBOARD_REQUEST,
    id,
})

const updateAndSaveDashboardRequest = () => ({
    type: UPDATE_AND_SAVE_DASHBOARD_REQUEST,
})

const deleteDashboardRequest = (id: DashboardId) => ({
    type: DELETE_DASHBOARD_REQUEST,
    id,
})

const getMyDashboardPermissionsRequest = (id: DashboardId) => ({
    type: GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
    id,
})

const getDashboardsSuccess = (dashboards: DashboardIdList) => ({
    type: GET_DASHBOARDS_SUCCESS,
    dashboards,
})

const getDashboardSuccess = () => ({
    type: GET_DASHBOARD_SUCCESS,
})

const updateAndSaveDashboardSuccess = () => ({
    type: UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
})

const deleteDashboardSuccess = (id: DashboardId) => ({
    type: DELETE_DASHBOARD_SUCCESS,
    id,
})

const getMyDashboardPermissionsSuccess = (id: DashboardId) => ({
    type: GET_MY_DASHBOARD_PERMISSIONS_SUCCESS,
    id,
})

const getDashboardsFailure = (error: ErrorInUi) => ({
    type: GET_DASHBOARDS_FAILURE,
    error,
})

const getDashboardFailure = (error: ErrorInUi) => ({
    type: GET_DASHBOARD_FAILURE,
    error,
})

const updateAndSaveDashboardFailure = (error: ErrorInUi) => ({
    type: UPDATE_AND_SAVE_DASHBOARD_FAILURE,
    error,
})

const deleteDashboardFailure = (error: ErrorInUi) => ({
    type: DELETE_DASHBOARD_FAILURE,
    error,
})

const getMyDashboardPermissionsFailure = (id: DashboardId, error: ErrorInUi) => ({
    type: GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
    id,
    error,
})

export const getDashboards = () => (dispatch: Function) => {
    dispatch(getDashboardsRequest())
    return services.getDashboards()
        .then(handleEntities(dashboardsSchema, dispatch))
        .then((data) => {
            dispatch(getDashboardsSuccess(data))
        })
        .catch((e) => {
            dispatch(getDashboardsFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const getDashboard = (id: DashboardId) => (dispatch: Function) => {
    dispatch(getDashboardRequest(id))
    return services.getDashboard(id)
        .then((data) => ({
            ...data,
            layout: data.layout,
            new: false,
            saved: true,
        }))
        .then(handleEntities(dashboardSchema, dispatch))
        .then(() => dispatch(getDashboardSuccess()))
        .catch((e) => {
            dispatch(getDashboardFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const updateAndSaveDashboard = (dashboard: Dashboard) => (dispatch: Function) => {
    dispatch(updateAndSaveDashboardRequest())
    const createNew = dashboard.new

    return (createNew ?
        services.postDashboard(dashboard) :
        services.putDashboard(dashboard.id, dashboard)
    )
        .then((data) => ({
            ...data,
            ownPermissions: [...(dashboard.ownPermissions || []), ...(createNew ? ['read', 'write', 'share'] : [])],
            new: false,
            saved: true,
        }))
        .then(handleEntities(dashboardSchema, dispatch))
        .then((result) => {
            dispatch(successNotification({
                title: 'Success!',
                message: 'Dashboard saved successfully!',
            }))

            if (dashboard.id !== result) {
                dispatch(changeDashboardId(dashboard.id, result))
            }

            dispatch(updateAndSaveDashboardSuccess())
        })
        .catch((e) => {
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            dispatch(updateAndSaveDashboardFailure(e))

            throw e
        })
}

export const updateAndSaveCurrentDashboard = () => (dispatch: Function, getState: Function) => {
    const dashboard = selectOpenDashboard(getState())
    if (dashboard) {
        dispatch(updateAndSaveDashboard(dashboard))
    }
}

export const deleteDashboard = (id: DashboardId) => (dispatch: Function) => {
    dispatch(deleteDashboardRequest(id))
    return services.deleteDashboard(id)
        .then(() => dispatch(deleteDashboardSuccess(id)))
        .catch((e) => {
            dispatch(deleteDashboardFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const getMyDashboardPermissions = (id: DashboardId) => (dispatch: Function, getState: Function) => {
    dispatch(getMyDashboardPermissionsRequest(id))
    return services.getMyDashboardPermissions(id)
        .then((data) => {
            const currentUser = selectUserData(getState()) || {}
            return data
                .filter((item) => item.user === currentUser.username)
                .map((item) => item.operation)
        })
        .then((data) => {
            dispatch(getMyDashboardPermissionsSuccess(id))
            handleEntities(dashboardSchema, dispatch)({
                id,
                ownPermissions: data || [],
            })
        })
        .catch((e) => {
            dispatch(getMyDashboardPermissionsFailure(id, e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const updateDashboardChanges = (id: DashboardId, changes: {}) => (dispatch: Function, getState: Function) => {
    const dashboard = selectOpenDashboard(getState())

    if (dashboard) {
        dispatch(updateDashboard({
            ...dashboard,
            ...changes,
        }))
    }
}
