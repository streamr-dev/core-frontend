// @flow

export type Hash = string
export type Address = string

export type EthereumNetwork = {
    id: ?string,
    name: ?string
}

export type SmartContractConstantCall = Promise<any>

export type SmartContractTransactionCall = Promise<any> & {
    onTransactionHash: ((string) => any) => void,
    onComplete: ((any) => any) => void
}
