// @flow

import BN from 'bignumber.js'
import { I18n } from 'react-redux-i18n'

import { getContract, call, send } from '../../utils/smartContract'
import getConfig from '$shared/web3/config'
import getWeb3 from '$shared/web3/web3Provider'
import type { SmartContractCall, SmartContractTransaction } from '$shared/flowtype/web3-types'
import { fromAtto, toAtto } from '../../utils/math'
import { gasLimits } from '../../utils/constants'

const tokenContractMethods = () => getContract(getConfig().token).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getMyAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(fromAtto)
}

export const setMyAllowance = (amount: string | BN): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    const method = tokenContractMethods().approve(marketplaceContract().options.address, toAtto(amount).toFixed(0))
    return send(method, {
        gas: gasLimits.APPROVE,
    })
}
