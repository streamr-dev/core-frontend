// @flow

import type { StoreState } from '../flowtype/states/store-state'
import type { Dashboard } from '../flowtype/dashboard-types'
import { selectOpenDashboard } from '$userpages/modules/dashboard/selectors'

export const parseDashboard = (state: StoreState): {
    dashboard: ?Dashboard,
    canShare: boolean,
    canWrite: boolean
} => {
    const db = selectOpenDashboard(state)
    return {
        dashboard: db,
        canShare: !!db && db.new !== true && (db.ownPermissions || []).includes('share'),
        canWrite: !!(db && db.new === true) || ((db && db.ownPermissions) ? db.ownPermissions : []).includes('write'),
    }
}
