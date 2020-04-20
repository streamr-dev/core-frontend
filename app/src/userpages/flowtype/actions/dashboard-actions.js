// @flow

import type { DashboardId, DashboardIdList } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import {
    GET_DASHBOARDS_REQUEST,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,
} from '../../modules/dashboard/actions'

export type Action = {
    type: typeof GET_DASHBOARDS_REQUEST,
} | {
    type: typeof GET_DASHBOARDS_REQUEST
        | typeof GET_DASHBOARDS_REQUEST,
    id: DashboardId,
} | {
    type: typeof GET_DASHBOARDS_SUCCESS,
    dashboards: DashboardIdList,
} | {
    type: typeof GET_DASHBOARDS_FAILURE,
    error: ErrorInUi
}
