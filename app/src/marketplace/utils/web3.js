// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'
import { I18n } from 'react-redux-i18n'

import NoBalanceError from '$mp/errors/NoBalanceError'
import { StreamrWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { SmartContractCall } from '$shared/flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import { fromAtto } from './math'
import type { PaymentCurrency } from '$shared/flowtype/common-types'

declare var ethereum: Web3

const dataTokenContractMethods = () => getContract(getConfig().dataToken).methods
const daiTokenContractMethods = () => getContract(getConfig().daiToken).methods
const uniswapAdaptorMethods = () => getContract(getConfig().uniswapAdaptor).methods

export const getEthBalance = (web3Instance: StreamrWeb3): Promise<number> => (web3Instance.getDefaultAccount()
    .then((myAccount) => web3Instance.eth.getBalance(myAccount).then((balance) => BN(balance)))
    .then(fromAtto).then((result) => result.toString())
)

export const getDataTokenBalance = (web3Instance: StreamrWeb3): SmartContractCall<number> => (web3Instance.getDefaultAccount()
    .then((myAddress) => call(dataTokenContractMethods().balanceOf(myAddress)))
    .then(fromAtto).then((result) => result.toString())
)

export const getDaiTokenBalance = (web3Instance: StreamrWeb3): SmartContractCall<number> => (web3Instance.getDefaultAccount()
    .then((myAddress) => call(daiTokenContractMethods().balanceOf(myAddress)))
    .then(fromAtto).then((result) => result.toString())
)

export const getBalances = (): Promise<[BN, BN, BN]> => {
    const web3 = getWeb3()
    const ethPromise = getEthBalance(web3)
    const dataPromise = getDataTokenBalance(web3)
    const daiPromise = getDaiTokenBalance(web3)

    return Promise.all([ethPromise, dataPromise, daiPromise])
        .then((results) => {
            const ethBalance = BN(results[0])
            const dataBalance = BN(results[1])
            const daiBalance = BN(results[2])
            return [ethBalance, dataBalance, daiBalance]
        })
}

/**
 * Returns the DAI and ETH value equivalents for a given quanity of DATA through a 'Uniswap'.
 * A safety margin is added to ensure transactions succeed incase of slippage and token volatility.
 * @param dataQuantity Number of DATA coins.
 */
export const getUniswapEquivalents = async (dataQuantity: string): Promise<[BN, BN]> => {
    const web3 = getWeb3()
    const amt = web3.utils.toWei(dataQuantity)
    const DATA = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const ETH = '0x0000000000000000000000000000000000000000'
    const DAI = process.env.DAI_TOKEN_CONTRACT_ADDRESS
    const safetyMargin = 1.05

    let ethValue = await call(uniswapAdaptorMethods().getConversionRate(DATA, ETH, amt))
    ethValue = BN(ethValue).toNumber() * safetyMargin
    ethValue = BN(web3.utils.fromWei(ethValue.toString()))

    let daiValue = await call(uniswapAdaptorMethods().getConversionRate(DATA, DAI, amt))
    daiValue = BN(daiValue).toNumber() * safetyMargin
    daiValue = BN(web3.utils.fromWei(daiValue.toString()))

    return [ethValue, daiValue]
}

export const validateBalanceForPurchase = async (price: BN, paymentCurrency: PaymentCurrency) => {
    const [ethBalance, dataBalance, daiBalance] = await getBalances()
    const [ethPrice, daiPrice] = await getUniswapEquivalents(price.toString())
    const requiredEth = ethPrice
    const requiredGas = fromAtto(gasLimits.BUY_PRODUCT)
    const requiredDai = daiPrice

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            if (ethBalance.isLessThan(requiredEth) || ethBalance.isLessThan(ethPrice)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        case paymentCurrencies.DATA:
            if (ethBalance.isLessThan(requiredEth) || dataBalance.isLessThan(price)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        case paymentCurrencies.DAI:
            if (ethBalance.isLessThan(requiredEth) || daiBalance.isLessThan(daiPrice)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        default:
            break
    }
}
