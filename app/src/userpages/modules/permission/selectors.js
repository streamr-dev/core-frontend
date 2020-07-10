// @flow

import { createSelector } from 'reselect'

import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { PermissionState } from '$userpages/flowtype/states/permission-state'

const selectUserPagePermissionState = (state: StoreState): PermissionState => state.permission

export const selectFetchingPermissions: (StoreState) => boolean = createSelector(
    selectUserPagePermissionState,
    (subState: PermissionState): boolean => subState.fetching,
)

export const selectPermissions: (StoreState) => Object = createSelector(
    selectUserPagePermissionState,
    (subState: PermissionState): Object => (subState.byTypeAndId || {}),
)

export const selectStreamPermissions: (StoreState) => Object = createSelector(
    selectPermissions,
    (permissions: Object): Object => (permissions.STREAM || {}),
)

export const selectCanvasPermissions: (StoreState) => Object = createSelector(
    selectPermissions,
    (permissions: Object): Object => (permissions.CANVAS || {}),
)
export const selectDashboardPermissions: (StoreState) => Object = createSelector(
    selectPermissions,
    (permissions: Object): Object => (permissions.DASHBOARD || {}),
)
