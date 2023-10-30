import { $Values } from 'utility-types'
import { contractCurrencies, paymentCurrencies } from '../utils/constants'

export type ContractCurrency = $Values<typeof contractCurrencies>

export type PaymentCurrency = $Values<typeof paymentCurrencies>

export type ErrorInUi = {
    message: string
    statusCode?: number | null | undefined
    code?: string | null | undefined
}
