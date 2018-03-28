// @flow

import type {SmartContractCall} from '../../flowtype/web3-types'
import {getContract, call} from '../../utils/smartContract'
import {smartContracts} from '../../web3/web3Config'
import getWeb3 from '../../web3/web3Provider'

const {token, marketplace} = smartContracts

export const getAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => {
            return call(
                getContract(token.address, token.abi).methods.allowance(myAddress, marketplace.address)
            )
        })
}
