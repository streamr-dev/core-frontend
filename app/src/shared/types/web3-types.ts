import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-core'
import Transaction from '$shared/utils/Transaction'
import TransactionError from '$shared/errors/TransactionError'
import { ProjectId } from '$mp/types/project-types'
import { NumberString, TransactionState, TransactionType } from './common-types'
export type Hash = string
export type Address = string
export type Receipt = TransactionReceipt
export type Abi = Array<AbiItem>

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
    productId?: ProjectId
    timestamp?: number
}
export type TransactionEntityList = Array<TransactionEntity>
export type TransactionEntities = Record<Hash, TransactionEntity>
