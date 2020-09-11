import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '$shared/modules/entities/selectors'
import { dashboardsSchema } from '$shared/modules/entities/schema'

const selectUserPageDashboardState = (state) => state.dashboard

export const selectDashboardIds = createSelector(
    selectUserPageDashboardState,
    (subState) => subState.ids,
)

export const selectDashboards = createSelector(
    selectDashboardIds,
    selectEntities,
    (result, entities) => denormalize(result, dashboardsSchema, entities),
)

export const selectFetching = createSelector(
    selectUserPageDashboardState,
    (subState) => subState.fetching,
)
