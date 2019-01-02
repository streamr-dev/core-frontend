// @flow

import { notificationIcons } from '../utils/constants'
import type { Hash } from '$shared/flowtype/web3-types'
import type { TimeUnit } from '$shared/flowtype/common-types'

export type Purchase = {
    time: number,
    timeUnit: TimeUnit,
}

export type NotificationIcon = $Values<typeof notificationIcons>

export type Notification = {
    id: number,
    created: Date, // TODO: Rename to createdAt. — Mariusz
    title?: string,
    description?: string,
    txHash?: ?Hash,
    icon?: ?NotificationIcon,
}
