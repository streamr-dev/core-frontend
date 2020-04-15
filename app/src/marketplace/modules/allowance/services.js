// @flow

import BN from 'bignumber.js'
import { I18n } from 'react-redux-i18n'

import { getContract, call, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import getWeb3 from '$shared/web3/web3Provider'
import type { SmartContractCall, SmartContractTransaction } from '$shared/flowtype/web3-types'
import { fromAtto, toAtto } from '$mp/utils/math'
import { gasLimits } from '$shared/utils/constants'

const dataTokenContractMethods = () => getContract(getConfig().dataToken).methods
const daiTokenContractMethods = () => getContract(getConfig().daiToken).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getMyDataAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(dataTokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(fromAtto)
}

export const setMyDataAllowance = (amount: string | BN): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    const method = dataTokenContractMethods().approve(marketplaceContract().options.address, toAtto(amount).toFixed(0))
    return send(method, {
        gas: gasLimits.APPROVE,
    })
}

export const getMyDaiAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(daiTokenContractMethods().allowance(myAddress, process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS)))
        .then(fromAtto)
}

export const setMyDaiAllowance = (amount: string | BN): SmartContractTransaction => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    const method = daiTokenContractMethods().approve(process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS, toAtto(amount).toFixed(0))
    return send(method, {
        gas: gasLimits.APPROVE,
    })
}
