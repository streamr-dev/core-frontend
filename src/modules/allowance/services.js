// @flow

import EventEmitter from 'events'

import type { SmartContractCall } from '../../flowtype/web3-types'
import { getContract, call } from '../../utils/smartContract'
import tokenConfig from '../../web3/token.config'
import marketplaceConfig from '../../web3/marketplace.config'
import getWeb3 from '../../web3/web3Provider'
import Transaction from '../../utils/Transaction'

const allowanceEmitter = () => {
    const emitter = new EventEmitter()

    setTimeout(() => {
        emitter.emit('transactionHash', '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz')
    }, 1000)
    setTimeout(() => {
        emitter.emit('receipt', {
            transactionHash: '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz',
            // …
            gasUsed: 30234,
        })
    }, 3000)
    return emitter
}

export const setMyAllowance = (): Transaction => new Transaction(allowanceEmitter())

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    const tokenContract = getContract(tokenConfig)
    const marketplaceContract = getContract(marketplaceConfig)
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContract.methods.allowance(myAddress, marketplaceContract.options.address)))
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(getContract(tokenConfig).methods.balanceOf(myAddress)))
}
