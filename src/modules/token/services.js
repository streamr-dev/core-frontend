// @flow

import type { SmartContractCall } from '../../flowtype/web3-types'
import { getContract, call } from '../../utils/smartContract'
import tokenConfig from '../../web3/token.config'
import marketplaceConfig from '../../web3/marketplace.config'
import getWeb3 from '../../web3/web3Provider'

export const getMyAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    const tokenContract = getContract(tokenConfig)
    const marketplaceContract = getContract(marketplaceConfig)
    return web3.getDefaultAccount()
        .then((myAddress) => call(
            tokenContract.methods.allowance(myAddress, marketplaceContract.options.address)
        ))
}

export const getMyTokenBalance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(getContract(tokenConfig).methods.balanceOf(myAddress)))
}
