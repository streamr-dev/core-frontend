// @flow

import type { PayloadAction } from '../../flowtype/common-types'

export type ShowNotificationParam = {
    title: string,
    description?: string,
}

export type ShowNotificationAction = PayloadAction<ShowNotificationParam>

export type ShowNotificationActionCreator = (title: string, description?: string) => ShowNotificationAction

export type HideNotificationParam = {
    id: number,
}

export type HideNotificationAction = PayloadAction<HideNotificationParam>

export type HideNotificationActionCreator = (id: number) => HideNotificationAction
