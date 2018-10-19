// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { DashboardId, Dashboard, DashboardList } from '$userpages/flowtype/dashboard-types'

export const getDashboards = (): ApiResult<DashboardList> => get(formatApiUrl('dashboards'))

export const getDashboard = (id: DashboardId): ApiResult<Dashboard> => get(formatApiUrl('dashboards', id))
