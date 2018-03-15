// @flow

export type Hash = string
export type Address = string

export type EthereumNetwork = {
    id: ?string,
    name: ?string
}

export type SmartContractCall = Promise<any>
