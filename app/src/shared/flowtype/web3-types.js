// @flow

import Web3 from 'web3'
import type Transaction from '$shared/utils/Transaction'
import type TransactionError from '$shared/errors/TransactionError'
import type { ProductId } from '$mp/flowtype/product-types'

import type { NumberString, TransactionState, TransactionType } from './common-types'

export type Hash = string
export type Address = string
export type Receipt = {
    transactionHash: Hash,
    contractAddress?: Address,
}
export type Abi = Array<{}>
export type Web3Provider = Web3.providers.HTTPProvider | Web3.providers.WebsocketProvider | Web3.providers.IpcProvider | {
    isMetaMask: true
}

export type EthereumNetwork = {
    id: ?string,
    name: ?string
}

export type SmartContractConfig = {
    abi: Abi,
    address: Address
}

export type SmartContractCall<T> = Promise<T>

export type SmartContractTransaction = Transaction

export type HashList = Array<Hash>

export type TransactionEntity = {
    id: string, // use separate id for special cases where there are duplicate transaction id
    hash: Hash, // actual transaction id
    type?: TransactionType,
    state: TransactionState,
    receipt: ?Receipt,
    error: ?TransactionError,
    value?: NumberString,
    gasUsed?: number,
    gasPrice?: number,
    productId?: ProductId,
    timestamp?: number,
}

export type TransactionEntityList = Array<TransactionEntity>

export type TransactionEntities = {
    [Hash]: TransactionEntity,
}

export type EventLog = {
    id: string,
    transactionHash: Hash,
    blockHash: Hash,
    blockNumber: number,
    type: string,
}

export type EventLogList = Array<EventLog>
