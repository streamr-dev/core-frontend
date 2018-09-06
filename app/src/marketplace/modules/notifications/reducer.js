// @flow

import { handleActions } from 'redux-actions'

import type { NotificationState } from '../../flowtype/store-state'
import type { ShowNotificationAction, HideNotificationAction } from './types'

import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './constants'

export const initialState: NotificationState = {
    notifications: [],
}

const reducer: (NotificationState) => NotificationState = handleActions({
    [SHOW_NOTIFICATION]: (state: NotificationState, action: ShowNotificationAction) => ({
        ...state,
        notifications: [
            action.payload,
            ...state.notifications,
        ],
    }),

    [HIDE_NOTIFICATION]: (state: NotificationState, action: HideNotificationAction) => ({
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload.id),
    }),
}, initialState)

export default reducer
