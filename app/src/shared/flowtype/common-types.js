// @flow

import { currencies, timeUnits, transactionStates, transactionTypes } from '../utils/constants'

export type Currency = $Values<typeof currencies>

export type TimeUnit = $Values<typeof timeUnits>

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

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type PropertySetter<T> = (string, T) => void

export type ApiResult<T> = Promise<T>

export type TransactionState = $Values<typeof transactionStates>

export type TransactionType = $Values<typeof transactionTypes>

export type Ref<T> = {
    current: null | T,
}

export type UseStateTuple<T> = [T, ((T => T) | T) => void]
