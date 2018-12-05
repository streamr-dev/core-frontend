// @flow

import { currencies, timeUnits, notificationIcons } from '../utils/constants'

import type { Hash } from '$shared/flowtype/web3-types'

export type Currency = $Values<typeof currencies>

export type TimeUnit = $Values<typeof timeUnits>

export type NumberString = string // Must be parsable to BigNumber

export type ErrorFromApi = {
    message: string,
    code?: string
}

export type Purchase = {
    time: number,
    timeUnit: TimeUnit,
}

export type NotificationIcon = $Values<typeof notificationIcons>

export type Notification = {
    id: number,
    created: Date,
    title: string,
    description?: string,
    txHash?: Hash,
    icon?: NotificationIcon,
}
