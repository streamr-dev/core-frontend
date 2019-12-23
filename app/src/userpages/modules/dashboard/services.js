// @flow

import { get, post, put, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { DashboardId, Dashboard, DashboardList } from '$userpages/flowtype/dashboard-types'
import type { Permission } from '$userpages/flowtype/permission-types'

export const getDashboards = (params: any): ApiResult<DashboardList> => get({
    url: formatApiUrl('dashboards'),
    options: { params },
})

export const getDashboard = (id: DashboardId): ApiResult<Dashboard> => get({
    url: formatApiUrl('dashboards', id),
})

export const deleteDashboard = (id: DashboardId): ApiResult<null> => del({
    url: formatApiUrl('dashboards', id),
})

export const getMyDashboardPermissions = (id: DashboardId): ApiResult<Array<Permission>> => get({
    url: formatApiUrl('dashboards', id, 'permissions', 'me'),
})

export const postDashboard = (dashboard: Dashboard): ApiResult<Dashboard> => post({
    url: formatApiUrl('dashboards'),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})

export const putDashboard = (id: DashboardId, dashboard: Dashboard): ApiResult<Dashboard> => put({
    url: formatApiUrl('dashboards', id),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})
