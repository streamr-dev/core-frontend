// @flow

import { currencies, timeUnits, transactionStates, transactionTypes, notificationIcons } from '../utils/constants'
import type { Hash } from '../flowtype/web3-types'

export type Currency = $Values<typeof currencies>

export type TimeUnit = $Values<typeof timeUnits>

export type TransactionState = $Values<typeof transactionStates>

export type TransactionType = $Values<typeof transactionTypes>

export type NumberString = string // Must be parsable to BigNumber

export type ErrorFromApi = {
    message: string,
    code?: string
}

export type ErrorInUi = {
    message: string,
    statusCode?: ?number,
    code?: ?string
}

export type ReduxAction = {
    type: string,
}

export type ReduxActionCreator = () => ReduxAction

export type PayloadAction<P> = ReduxAction & {
    payload: P,
}

export type ApiResult<T> = Promise<T>

export type Purchase = {
    time: number,
    timeUnit: TimeUnit,
}

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type PropertySetter<T> = (string, T) => void

export type NotificationIcon = $Values<typeof notificationIcons>

export type Notification = {
    id: number,
    created: Date,
    title: string,
    description?: string,
    txHash?: Hash,
    icon?: NotificationIcon,
}
