// @flow

import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'
import { getContract, call, send } from '../../utils/smartContract'
import getConfig from '../../web3/web3Config'
import getWeb3 from '../../web3/web3Provider'

const tokenContractMethods = () => getContract(getConfig().token).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
}

export const setAllowance = (amount: number): SmartContractTransaction => {
    if (amount < 0) {
        throw new Error('Amount must be non-negative!')
    }
    return send(tokenContractMethods()
        .approve(marketplaceContract().options.address, amount))
}
