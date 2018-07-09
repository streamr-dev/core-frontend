// @flow

import EventEmitter from 'events'
import type { PromiEvent } from 'web3'
import { I18n } from '@streamr/streamr-layout'

import getWeb3, { getPublicWeb3, StreamrWeb3 } from '../web3/web3Provider'
import TransactionError from '../errors/TransactionError'
import getConfig from '../web3/config'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
} from '../flowtype/web3-types'

import Transaction from './Transaction'
import { ethereumNetworks, gasLimits } from './constants'

export type Callable = {
    call: () => SmartContractCall<*>,
}

export type Sendable = {
    send: ({
        from: Address,
    }) => PromiEvent,
}

// TODO: is string comparison enough?
export const areAddressesEqual = (first: Address, second: Address) => first.toLowerCase() === second.toLowerCase()

export const hexEqualsZero = (hex: string): boolean => /^(0x)?0+$/.test(hex)

export const getContract = ({ abi, address }: SmartContractConfig, usePublicNode: boolean = false): StreamrWeb3.eth.Contract => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const checkEthereumNetworkIsCorrect = (web3Instance: StreamrWeb3): Promise<void> => web3Instance.getEthereumNetwork()
    .then((network) => {
        const { networkId: requiredNetwork } = getConfig()
        const requiredNetworkName = ethereumNetworks[requiredNetwork]
        const currentNetworkName = ethereumNetworks[network] || `#${network}`
        if (network.toString() !== requiredNetwork.toString()) {
            throw new Error(I18n.t('validation.incorrectEthereumNetwork', {
                requiredNetworkName,
                currentNetworkName,
            }))
        }
    })

export const call = (method: Callable): SmartContractCall<*> => method.call()

export const send = (method: Sendable, options?: {
    gas?: number,
}): SmartContractTransaction => {
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
            const sentMethod = method
                .send({
                    gas: (options && options.gas) || gasLimits.DEFAULT,
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
                        errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        }, errorHandler)

    return tx
}
