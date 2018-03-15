// @flow

import type { Web3, PromiEvent } from 'web3'
import type { SmartContractCall } from '../flowtype/web3-types'

type Callable = {
    call: () => SmartContractCall,
}

type Sendable = {
    send: () => PromiEvent,
}

exports.getContract = (web3: Web3, address: string, abi: Array<{}>) => web3.getDefaultAccount()
    .then(account => new web3.eth.Contract(abi, address, {
        from: account
    }))

const requireMethod = (method?: Callable | Sendable): SmartContractCall => {
    return method ? Promise.resolve(method) : Promise.reject(new Error('Method not defined'))
}

exports.call = (method?: Callable): SmartContractCall => {
    return requireMethod(method).then((method: Callable) => method.call())
}

exports.send = (method?: Sendable, onHash: (string) => void): SmartContractCall => {
    return requireMethod(method).then((method: Sendable) => {
        const getReceipt = method.send()

        return new Promise((resolve, reject) => {
            getReceipt.on('error', reject)
            getReceipt.on('onTransactionHash', (transactionHash: string) => {
                getReceipt.off('error', reject)
                resolve(transactionHash)
            })
        })
            .then(onHash)
            .then(() => getReceipt)
    })
}
