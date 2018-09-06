// @flow

import BN from 'bignumber.js'

import getWeb3 from '../web3/web3Provider'
import getConfig from '../web3/config'
import type { SmartContractCall } from '../flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { fromAtto } from './math'

const tokenContractMethods = () => getContract(getConfig().token).methods

export const getEthBalance = (): Promise<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAccount) => web3.eth.getBalance(myAccount).then((balance) => BN(balance)))
        .then(fromAtto)
}

export const getDataTokenBalance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
        .then(fromAtto)
}
