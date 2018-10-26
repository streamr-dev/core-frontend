// @flow

import type { DashboardId, DashboardIdList } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import {
    UPDATE_AND_SAVE_DASHBOARD_REQUEST,
    UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
    UPDATE_AND_SAVE_DASHBOARD_FAILURE,
    DELETE_DASHBOARD_REQUEST,
    DELETE_DASHBOARD_SUCCESS,
    DELETE_DASHBOARD_FAILURE,
    GET_DASHBOARDS_REQUEST,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,
    GET_DASHBOARD_REQUEST,
    GET_DASHBOARD_SUCCESS,
    GET_DASHBOARD_FAILURE,
    GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
    GET_MY_DASHBOARD_PERMISSIONS_SUCCESS,
    GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
    OPEN_DASHBOARD,
    CHANGE_DASHBOARD_ID,
} from '../../modules/dashboard/actions'

export type Action = {
    type: typeof UPDATE_AND_SAVE_DASHBOARD_REQUEST
        | typeof DELETE_DASHBOARD_REQUEST
        | typeof GET_DASHBOARDS_REQUEST
        | typeof GET_DASHBOARD_SUCCESS
        | typeof UPDATE_AND_SAVE_DASHBOARD_SUCCESS,
} | {
    type: typeof OPEN_DASHBOARD
        | typeof GET_DASHBOARD_REQUEST
        | typeof GET_DASHBOARDS_REQUEST
        | typeof GET_DASHBOARDS_REQUEST
        | typeof DELETE_DASHBOARD_REQUEST
        | typeof DELETE_DASHBOARD_SUCCESS
        | typeof GET_MY_DASHBOARD_PERMISSIONS_SUCCESS
        | typeof GET_MY_DASHBOARD_PERMISSIONS_REQUEST,
    id: DashboardId,
} | {
    type: typeof GET_DASHBOARDS_SUCCESS,
    dashboards: DashboardIdList,
} | {
    type: typeof CHANGE_DASHBOARD_ID,
    oldId: DashboardId,
    newId: DashboardId
} | {
    type: typeof GET_DASHBOARDS_FAILURE
        | typeof GET_DASHBOARD_FAILURE
        | typeof DELETE_DASHBOARD_FAILURE
        | typeof UPDATE_AND_SAVE_DASHBOARD_FAILURE,
    error: ErrorInUi
} | {
    type: typeof GET_MY_DASHBOARD_PERMISSIONS_FAILURE,
    id: DashboardId,
    error: ErrorInUi
}
