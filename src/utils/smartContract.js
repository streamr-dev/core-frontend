// @flow
import EventEmitter from 'events'
import getWeb3 from '../web3/web3Provider'

import type {PromiEvent} from 'web3'
import type {SmartContractCall, Address, Abi, SmartContractTransaction} from '../flowtype/web3-types'
import TransactionError from '../errors/TransactionError'
import Transaction from './Transaction'

type Callable = {
    call: () => SmartContractCall<*>,
}

type Sendable = {
    send: ({
        from: Address
    }) => PromiEvent,
}

export const hexEqualsZero = (hex: string) => /^(0x)?0+$/.test(hex)

export const asciiToHex = (val: string) => getWeb3().utils.asciiToHex(val)

export const getContract = (address: Address, abi: Abi) => {
    const web3 = getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const call = (method: Callable): SmartContractCall<*> => method.call()

export const send = (method: Sendable): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    web3.getDefaultAccount()
        .then((account: Address) => {
            const sentMethod = method.send({
                from: account
            })
                .on('error', errorHandler)
                .on('transactionHash', (hash) => {
                    sentMethod.off('error', errorHandler)
                    sentMethod.on('error', (error, receipt) => {
                        errorHandler(new TransactionError(error.message, receipt))
                    })
                    emitter.emit('transactionHash', hash)
                })
                .on('receipt', (receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionError('Transaction failed', receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        })
        .catch(errorHandler)

    return tx
}
