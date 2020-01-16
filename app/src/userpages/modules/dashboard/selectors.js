// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { DashboardState } from '$userpages/flowtype/states/dashboard-state'
import type { DashboardId, DashboardIdList, Dashboard, DashboardList } from '$userpages/flowtype/dashboard-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { dashboardsSchema, dashboardSchema } from '$shared/modules/entities/schema'

const selectUserPageDashboardState = (state: StoreState): DashboardState => state.dashboard

export const selectDashboardIds: (StoreState) => DashboardIdList = createSelector(
    selectUserPageDashboardState,
    (subState: DashboardState): DashboardIdList => subState.ids,
)

export const selectDashboards: (StoreState) => DashboardList = createSelector(
    selectDashboardIds,
    selectEntities,
    (result: DashboardIdList, entities: EntitiesState): DashboardList => denormalize(result, dashboardsSchema, entities),
)

export const selectOpenDashboardId: (StoreState) => ?DashboardId = createSelector(
    selectUserPageDashboardState,
    (subState: DashboardState): ?DashboardId => subState.openDashboard.id,
)

export const selectOpenDashboard: (StoreState) => ?Dashboard = createSelector(
    selectOpenDashboardId,
    selectEntities,
    (result: ?DashboardId, entities: EntitiesState): ?Dashboard => denormalize(result, dashboardSchema, entities),
)

export const selectFetching: (StoreState) => boolean = createSelector(
    selectUserPageDashboardState,
    (subState: DashboardState): boolean => subState.fetching,
)
