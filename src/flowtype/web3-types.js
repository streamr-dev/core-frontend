// @flow

import EventEmitter from 'events'

export type Hash = string
export type Address = string
export type Receipt = {}

export type EthereumNetwork = {
    id: ?string,
    name: ?string
}

export type SmartContractCall = Promise<any>

type CustomEventEmitter<E: ['string', Function]> = EventEmitter & {
    on(...a: E): void,
    removeListener(...a: E): void,
}

export type SmartContractTransaction = CustomEventEmitter<['transactionHash', Hash] | ['onComplete', Receipt] | ['error', Error, ?Receipt]>

