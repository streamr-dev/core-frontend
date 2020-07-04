// @flow

import { get, post, put, del } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { DashboardId, Dashboard, DashboardList } from '$userpages/flowtype/dashboard-types'
import routes from '$routes'

export const getDashboards = (params: any): ApiResult<DashboardList> => get({
    url: routes.api.dashboards.index(),
    options: { params },
})

export const getDashboard = (id: DashboardId): ApiResult<Dashboard> => get({
    url: routes.api.dashboards.show({
        id,
    }),
})

export const deleteDashboard = (id: DashboardId): ApiResult<null> => del({
    url: routes.api.dashboards.show({
        id,
    }),
})

export const postDashboard = (dashboard: Dashboard): ApiResult<Dashboard> => post({
    url: routes.api.dashboards.index(),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})

export const putDashboard = (id: DashboardId, dashboard: Dashboard): ApiResult<Dashboard> => put({
    url: routes.api.dashboards.show({
        id,
    }),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})
