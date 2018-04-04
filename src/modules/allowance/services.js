// @flow

import { getContract, call, send } from '../../utils/smartContract'
import tokenConfig from '../../web3/token.config'
import marketplaceConfig from '../../web3/marketplace.config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'

const tokenContractMethods = () => getContract(tokenConfig).methods
const marketplaceContract = () => getContract(marketplaceConfig)

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    const tokenContract = getContract(tokenConfig)
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContract.methods.allowance(myAddress, marketplaceContract().options.address)))
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(getContract(tokenConfig).methods.balanceOf(myAddress)))
}

export const setMyAllowance = (amount: number): SmartContractTransaction => {
    if (amount < 0) {
        throw new Error('Amount must be non-negative!')
    }
    return send(tokenContractMethods()
        .approve(marketplaceContract().options.address, amount))
}
