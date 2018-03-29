// @flow

import type {SmartContractCall, SmartContractTransaction} from '../../flowtype/web3-types'
import {getContract, call, send} from '../../utils/smartContract'
import {smartContracts} from '../../web3/web3Config'
import getWeb3 from '../../web3/web3Provider'

const {token, marketplace} = smartContracts

const tokenContractMethods = () => getContract(token.address, token.abi).methods

export const getAllowance = (): SmartContractCall<number> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => {
            return call(
                tokenContractMethods().allowance(myAddress, marketplace.address)
            )
        })
}

export const setAllowance = (amount: number): SmartContractTransaction => {
    if (amount < 0) {
        throw new Error('Amount must be non-negative!')
    }
    return send(
        tokenContractMethods().approve(marketplace.address, amount)
    )
}
