// @flow

import type {SmartContractConstantCall, SmartContractTransactionCall} from '../flowtype/web3-types'
import type {Web3} from 'web3'

exports.getContract = (web3: Web3, address: string, abi: Array<{}>) => web3.getDefaultAccount()
    .then(account => new web3.eth.Contract(abi, address, {
        from: account
    }))

exports.wrapConstantCall = (method?: {
    call: () => SmartContractConstantCall
}) => {
    if (!method) {
        throw new Error('Method not found')
    }
    return method.call()
}

exports.wrapTransactionCall = (method?: {
    send: () => Promise<any> & {
        on: ('transactionHash', (string) => any) => any,
        onTransactionHash: any,
        onComplete: any
    }
}) => {
    if (!method) {
        throw new Error('Method not found')
    }
    const p = method.send()
    p.onTransactionHash = (func: (string) => void) => {
        p.on('transactionHash', func)
    }
    p.onComplete = (func: (any) => any) => {
        p.then(func)
    }
    return p
}
