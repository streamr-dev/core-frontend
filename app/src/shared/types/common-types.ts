import {$Values} from 'utility-types'
import {contractCurrencies, paymentCurrencies, transactionStates, transactionTypes,} from '../utils/constants'

export type ContractCurrency = $Values<typeof contractCurrencies>
export type PaymentCurrency = $Values<typeof paymentCurrencies>
export type NumberString = string // Must be parsable to BigNumber

export type ErrorFromApi = {
    message: string
    code?: string
}
export type ErrorInUi = {
    message: string
    statusCode?: number | null | undefined
    code?: string | null | undefined
}
export type ReduxAction = {
    type: string
}
export type ReduxActionCreator = () => ReduxAction
export type PayloadAction<P> = ReduxAction & {
    payload: P
}
export type RequestMethod = 'get' | 'post' | 'put' | 'delete'
export type PropertySetter<T> = (arg0: string, arg1: T) => void
export type ApiResult<T> = Promise<T>
export type TransactionState = $Values<typeof transactionStates>
export type TransactionType = $Values<typeof transactionTypes>
export type Ref<T> = {
    current: null | T
}
