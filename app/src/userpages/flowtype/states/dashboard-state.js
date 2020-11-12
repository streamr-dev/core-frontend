// @flow

import type { DashboardIdList } from '../dashboard-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export type DashboardState = {
    ids: DashboardIdList,
    error: ?ErrorInUi,
    fetching: boolean,
}
