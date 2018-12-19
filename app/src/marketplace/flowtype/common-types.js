// @flow

import { notificationIcons } from '../utils/constants'
import type { TimeUnit } from '$shared/flowtype/common-types'

export type Purchase = {
    time: number,
    timeUnit: TimeUnit,
}

export type NotificationIcon = $Values<typeof notificationIcons>
