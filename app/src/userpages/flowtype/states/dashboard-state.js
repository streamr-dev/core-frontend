// @flow

import type { Dashboard, DashboardId } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type DashboardState = {
    byId: {
        [DashboardId]: Dashboard
    },
    openDashboard: {
        id: ?DashboardId,
        isFullScreen: boolean
    },
    error: ?ErrorInUi,
    fetching: boolean
}
