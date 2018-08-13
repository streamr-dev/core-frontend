// @flow

import BN from 'bignumber.js'
import { I18n } from '@streamr/streamr-layout'

import { getContract, call, send } from '../../utils/smartContract'
import getConfig from '../../web3/config'
import getWeb3 from '../../web3/web3Provider'
import type { SmartContractCall, SmartContractTransaction } from '../../flowtype/web3-types'
import { fromAtto, toAtto } from '../../utils/math'
import { gasLimits } from '../../utils/constants'
import { getDataTokenBalance } from '../../utils/web3'

const tokenContractMethods = () => getContract(getConfig().token).methods
const marketplaceContract = () => getContract(getConfig().marketplace)

export const getMyAllowance = (): SmartContractCall<BN> => {
    const web3 = getWeb3()
    return web3.getDefaultAccount()
        .then((myAddress) => call(tokenContractMethods().allowance(myAddress, marketplaceContract().options.address)))
        .then(fromAtto)
}

export const setMyAllowance = (amount: string | BN): Promise<SmartContractTransaction> => {
    if (BN(amount).isLessThan(0)) {
        throw new Error(I18n.t('error.negativeAmount'))
    }

    return getDataTokenBalance().then((balance: number) => {
        if (BN(amount).isGreaterThan(balance)) {
            throw new Error(I18n.t('error.noBalance'))
        }
        const method = tokenContractMethods().approve(marketplaceContract().options.address, toAtto(amount).toFixed(0))
        return send(method, {
            gas: gasLimits.APPROVE,
        })
    })
}
