// @flow

import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'
import { getContract, call, send } from '../../utils/smartContract'
import tokenConfig from '../../web3/token.config'
import marketplaceConfig from '../../web3/marketplace.config'
import getWeb3 from '../../web3/web3Provider'

const tokenContractMethods = () => getContract(tokenConfig).methods
const marketplaceContract = () => getContract(marketplaceConfig)
const marketplaceContractMethods = () => marketplaceContract().methods

export const getTokensFromWei = (wei: number) => (wei / 10e18)

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(parseFloat)
        .then(getTokensFromWei)
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().balanceOf(myAddress)))
        .then(parseFloat)
        .then(getTokensFromWei)
}

export const getDataPerUsd = (): SmartContractCall<number> => call(marketplaceContractMethods().dataPerUsd())
    .then(parseFloat)
    .then(getTokensFromWei)

export const setAllowance = (amount: number): SmartContractTransaction => {
    if (amount < 0) {
        throw new Error('Amount must be non-negative!')
    }
    return send(tokenContractMethods()
        .approve(marketplaceContract().options.address, amount))
}
