// @flow

import type Transaction from '../utils/Transaction'

export type Hash = string
export type Address = string
export type Receipt = {
    transactionHash: Hash,
}
export type Abi = Array<{}>

export type EthereumNetwork = {
    id: ?string,
    name: ?string
}

export type SmartContractConfig = {
    abi: Abi,
    environments: {
        [string]: {
            address: Address
        },
        default: {
            address: Address
        }
    }
}

export type SmartContractCall<T> = Promise<T>

export type SmartContractTransaction = Transaction

export type Web3Account = {
    address: Address,
    name: string,
}

export type Web3AccountList = Array<Web3Account>
