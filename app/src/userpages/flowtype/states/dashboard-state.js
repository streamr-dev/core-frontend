// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { DashboardIdList } from '../dashboard-types'

export type DashboardState = {
    ids: DashboardIdList,
    error: ?ErrorInUi,
    fetching: boolean,
}
