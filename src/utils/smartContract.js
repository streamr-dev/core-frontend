// @flow

import EventEmitter from 'events'
import getWeb3, { StreamrWeb3 } from '../web3/web3Provider'
import { ethereumNetworks } from './constants'
import TransactionError from '../errors/TransactionError'
import Transaction from './Transaction'
import getConfig from '../web3/web3Config'

import type { PromiEvent } from 'web3'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
} from '../flowtype/web3-types'

export type Callable = {
    call: () => SmartContractCall<*>,
}

export type Sendable = {
    send: ({
        from: Address
    }) => PromiEvent,
}

export const hexEqualsZero = (hex: string) => /^(0x)?0+$/.test(hex)

export const asciiToHex = (val: string) => getWeb3().utils.asciiToHex(val)

export const getContract = ({ abi, address }: SmartContractConfig): StreamrWeb3.eth.Contract => {
    const web3 = getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const { networkId: requiredNetwork } = getConfig()
        const requiredNetworkName = ethereumNetworks[requiredNetwork]
        if (network.toString() !== requiredNetwork.toString()) {
            throw new Error(`The Ethereum network is wrong, please use ${requiredNetworkName} network`)
        }
    })

export const call = (method: Callable): SmartContractCall<*> => method.call()

export const send = (method: Sendable): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account]) => {
            const sentMethod = method.send({
                from: account,
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
