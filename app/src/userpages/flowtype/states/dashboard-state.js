// @flow

import type { DashboardId, DashboardIdList } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type DashboardState = {
    ids: DashboardIdList,
    openDashboard: {
        id: ?DashboardId,
        isFullScreen: boolean
    },
    error: ?ErrorInUi,
    fetching: boolean,
}
