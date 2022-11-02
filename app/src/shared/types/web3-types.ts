import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-core'
import type Transaction from '$shared/utils/Transaction'
import type TransactionError from '$shared/errors/TransactionError'
import type { ProductId } from '$mp/types/product-types'
import type { NumberString, TransactionState, TransactionType } from './common-types'
export type Hash = string
export type Address = string
export type Receipt = TransactionReceipt
export type Abi = Array<AbiItem>

export type EthereumNetwork = {
    id: string | null | undefined
    name: string | null | undefined
}
export type SmartContractConfig = {
    abi: Abi
    address: Address
}
export type SmartContractCall<T> = Promise<T>
export type SmartContractTransaction = Transaction
export type HashList = Array<Hash>
export type TransactionEntity = {
    id: string
    // use separate id for special cases where there are duplicate transaction id
    hash: Hash
    // actual transaction id
    type?: TransactionType
    state: TransactionState
    receipt: Receipt | null | undefined
    error: TransactionError | null | undefined
    value?: NumberString
    gasUsed?: number
    gasPrice?: number
    productId?: ProductId
    timestamp?: number
}
export type TransactionEntityList = Array<TransactionEntity>
export type TransactionEntities = Record<Hash, TransactionEntity>
export type EventLog = {
    id: string
    transactionHash: Hash
    blockHash: Hash
    blockNumber: number
    type: string
}
export type EventLogList = Array<EventLog>
