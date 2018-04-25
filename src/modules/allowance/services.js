// @flow

import BN from 'bignumber.js'

import { getContract, call, send, fromWeis, toWeiString } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'

const tokenContractMethods = () => getContract(getConfig().token).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getMyAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(fromWeis)
}

export const getMyTokenBalance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
        .then(fromWeis)
}

export const setMyAllowance = (amount: BN): SmartContractTransaction => {
    if (amount.isLessThan(0)) {
        throw new Error('Amount must be non-negative!')
    }
    return send(tokenContractMethods()
        .approve(marketplaceContract().options.address, toWeiString(amount)))
}
