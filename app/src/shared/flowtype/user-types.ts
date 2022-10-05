import { $Values } from 'utility-types'
import type { NumberString } from '$shared/flowtype/common-types'
export type UserId = string
export type User = {
    id?: number
    email: string
    name: string
    username: string
    imageUrlSmall: string
    imageUrlLarge: string
}
export type Challenge = {
    challenge: string
    expires: Date
    id: string
}
export const BalanceType = {
    ETH: 'ETH',
    DATA: 'DATA',
}
export type Balances = Record<$Values<typeof BalanceType>, NumberString>
