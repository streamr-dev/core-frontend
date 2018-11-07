// @flow

import { get, post, put, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { DashboardId, Dashboard, DashboardList } from '$userpages/flowtype/dashboard-types'
import type { Permission } from '$userpages/flowtype/permission-types'

export const getDashboards = (): ApiResult<DashboardList> => get(formatApiUrl('dashboards'))

export const getDashboard = (id: DashboardId): ApiResult<Dashboard> => get(formatApiUrl('dashboards', id))

export const deleteDashboard = (id: DashboardId): ApiResult<null> => del(formatApiUrl('dashboards', id))

export const getMyDashboardPermissions = (id: DashboardId): ApiResult<Array<Permission>> =>
    get(formatApiUrl('dashboards', id, 'permissions', 'me'))

export const postDashboard = (dashboard: Dashboard): ApiResult<Dashboard> => post(formatApiUrl('dashboards'), {
    ...dashboard,
    layout: JSON.stringify(dashboard.layout),
})

export const putDashboard = (id: DashboardId, dashboard: Dashboard): ApiResult<Dashboard> => put(formatApiUrl('dashboards', id), {
    ...dashboard,
    layout: JSON.stringify(dashboard.layout),
})
