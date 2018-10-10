// @flow

import type { Dashboard } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type DashboardState = {
    byId: {
        [$ElementType<Dashboard, 'id'>]: Dashboard
    },
    openDashboard: {
        id: ?$ElementType<Dashboard, 'id'>,
        isFullScreen: boolean
    },
    error: ?ErrorInUi,
    fetching: boolean
}
