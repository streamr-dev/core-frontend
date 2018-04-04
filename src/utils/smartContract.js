// @flow

import EventEmitter from 'events'
import getWeb3, { StreamrWeb3 } from '../web3/web3Provider'

import type { PromiEvent } from 'web3'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
} from '../flowtype/web3-types'
import { ethereumNetworks } from './constants'
import commonConfig from '../web3/common.config'
import TransactionError from '../errors/TransactionError'
import Transaction from './Transaction'

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

export const getContract = ({ abi, environments }: SmartContractConfig): StreamrWeb3.eth.Contract => {
    const web3 = getWeb3()
    const env = process.env.NODE_ENV || 'default'
    const config = environments[env]
    const address = config && config.address
    return new web3.eth.Contract(abi, address)
}

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const env = process.env.NODE_ENV || 'default'
        const config = commonConfig.environments[env]
        const requiredNetwork = config && config.networkId
        const requiredNetworkName = ethereumNetworks[requiredNetwork]
        if (network.toString() !== requiredNetwork.toString()) {
            throw new Error(`The Ethereum network is wrong, please use ${ requiredNetworkName } network`)
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
