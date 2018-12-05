// @flow

import { transactionStates, transactionTypes } from '$shared/utils/constants'

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
