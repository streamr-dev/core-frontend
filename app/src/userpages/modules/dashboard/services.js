import { get, post, put, del } from '$shared/utils/api'
import routes from '$routes'

export const getDashboards = (params) => get({
    url: routes.api.dashboards.index(params),
})

export const getDashboard = (id) => get({
    url: routes.api.dashboards.show({
        id,
    }),
})

export const deleteDashboard = (id) => del({
    url: routes.api.dashboards.show({
        id,
    }),
})

export const postDashboard = (dashboard) => post({
    url: routes.api.dashboards.index(),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})

export const putDashboard = (id, dashboard) => put({
    url: routes.api.dashboards.show({
        id,
    }),
    data: {
        ...dashboard,
        layout: JSON.stringify(dashboard.layout),
    },
})
