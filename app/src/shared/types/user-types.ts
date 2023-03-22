import { $Values } from 'utility-types'
import { NumberString } from '$shared/types/common-types'
import {Address} from "$shared/types/web3-types"
export type UserAddress = Address
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
