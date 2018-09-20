// @flow

import { createSelector } from 'reselect'

import type { NotificationState, StoreState } from '../../flowtype/store-state'
import type { Notification } from '../../flowtype/common-types'

const selectNotificationState = (state: StoreState): NotificationState => state.notifications

export const selectNotifications: (StoreState) => Array<Notification> = createSelector(
    selectNotificationState,
    (subState: NotificationState): Array<Notification> => subState.notifications,
)
