// @flow

import type {SmartContractCall} from '../../flowtype/web3-types'
import {getContract, call} from '../../utils/smartContract'
import {smartContracts} from '../../web3/web3Config'
import getWeb3 from '../../web3/web3Provider'
import Transaction from '../../utils/Transaction'

// NOTE(mr): `buy` is temporary.
import EventEmitter from 'events'
const allowanceEmitter = (allowance: number) => {
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

export const setMyAllowance = (allowance: number): Transaction => new Transaction(allowanceEmitter(allowance))

const {token, marketplace} = smartContracts

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => {
            return call(
                getContract(token.address, token.abi).methods.allowance(myAddress, marketplace.address)
            )
        })
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => {
            return call(
                getContract(token.address, token.abi).methods.balanceOf(myAddress)
            )
        })
}
