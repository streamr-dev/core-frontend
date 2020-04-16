// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'
import { I18n } from 'react-redux-i18n'

import NoBalanceError from '$mp/errors/NoBalanceError'
import { getPublicWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { SmartContractCall, Address } from '$shared/flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import { fromAtto } from './math'
import type { PaymentCurrency } from '$shared/flowtype/common-types'

declare var ethereum: Web3

const UNISWAP_SAFETY_MARGIN = 1
const ETH = '0x0000000000000000000000000000000000000000'
const DAI = process.env.DAI_TOKEN_CONTRACT_ADDRESS
const DATA = process.env.DATA_TOKEN_CONTRACT_ADDRESS

const dataTokenContractMethods = (usePublicNode: boolean = false) => getContract(getConfig().dataToken, usePublicNode).methods
const daiTokenContractMethods = (usePublicNode: boolean = false) => getContract(getConfig().daiToken, usePublicNode).methods
const uniswapAdaptorMethods = (usePublicNode: boolean = false) => getContract(getConfig().uniswapAdaptor, usePublicNode).methods

export const getEthBalance = (address: Address, usePublicNode: boolean = false): Promise<BN> => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()

    return web3.eth.getBalance(address)
        .then((balance) => BN(balance))
        .then(fromAtto)
}

export const getDataTokenBalance = (address: Address, usePublicNode: boolean = false): SmartContractCall<BN> => (
    call(dataTokenContractMethods(usePublicNode).balanceOf(address))
        .then(fromAtto)
)

export const getDaiTokenBalance = (address: Address, usePublicNode: boolean = false): SmartContractCall<BN> => (
    call(daiTokenContractMethods(usePublicNode).balanceOf(address))
        .then(fromAtto)
)

export const getMyEthBalance = (): Promise<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getEthBalance(myAccount))
)

export const getMyDataTokenBalance = (): SmartContractCall<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getDataTokenBalance(myAccount))
)

export const getMyDaiTokenBalance = (): SmartContractCall<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getDaiTokenBalance(myAccount))
)

export const getBalances = (): Promise<[BN, BN, BN]> => {
    const ethPromise = getMyEthBalance()
    const dataPromise = getMyDataTokenBalance()
    const daiPromise = getMyDaiTokenBalance()

    return Promise.all([ethPromise, dataPromise, daiPromise])
}

/**
 * uniswapDATAtoETH & uniswapDATAtoDAI return the DAI and ETH value equivalents
 * for a given quantity of DATA through a 'Uniswap'.
 * A safety margin is added to ensure transactions succeed due to dynamic mainnet DATA exchange rates.
 *
 * !!!Note some versions of web3 will return a BigNumber from the Ethers library. This has a
 * different prototype compared with BigNumber (BN). This is why extra BNs are used in this function.
 * @param dataQuantity Number of DATA coins.
*/
export const uniswapDATAtoETH = async (dataQuantity: string, usePublicNode: boolean = false): Promise<BN> => {
    if (dataQuantity !== '0') {
        try {
            const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
            let productPriceDATA = web3.utils.toWei(dataQuantity)
            productPriceDATA = BN(productPriceDATA).multipliedBy((UNISWAP_SAFETY_MARGIN))
            productPriceDATA = BN(productPriceDATA).toFixed(0, 2)

            let uniswapETH = await call(uniswapAdaptorMethods().getConversionRateOutput(ETH, DATA, productPriceDATA))
            uniswapETH = BN(web3.utils.fromWei(uniswapETH.toString()))

            return uniswapETH
        } catch (e) {
            // Uniswap Adaptor contract has probably reverted the transaction.
            // This can happen when the order size exhausts the uniswap exchange.
            // In this case an invalid price is returned, primarily to block
            // progression in the purchase flow.

            return BN('infinity')
        }
    }
    return BN('infinity')
}

export const uniswapDATAtoDAI = async (dataQuantity: string, usePublicNode: boolean = false): Promise<BN> => {
    if (dataQuantity !== '0') {
        try {
            const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
            let productPriceDATA = web3.utils.toWei(dataQuantity)
            productPriceDATA = BN(productPriceDATA).multipliedBy((UNISWAP_SAFETY_MARGIN))
            productPriceDATA = BN(productPriceDATA).toFixed(0, 2)

            let uniswapDAI = await call(uniswapAdaptorMethods().getConversionRateOutput(DAI, DATA, productPriceDATA))
            uniswapDAI = BN(web3.utils.fromWei(uniswapDAI.toString()))

            return uniswapDAI
        } catch (e) {
            // Uniswap Adaptor contract has probably reverted the transaction.
            // This can happen when the order size exhausts the uniswap exchange.
            // In this case an invalid price is returned, primarily to block
            // progression in the purchase flow.

            return BN('infinity')
        }
    }
    return BN('infinity')
}

export const uniswapETHtoDATA = async (ethQuantity: string, usePublicNode: boolean = false): Promise<BN> => {
    if (ethQuantity !== '0') {
        try {
            const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
            const ethWei = web3.utils.toWei(ethQuantity)

            let uniswapDATA = await call(uniswapAdaptorMethods().getConversionRateOutput(DATA, ETH, ethWei))
            uniswapDATA = BN(web3.utils.fromWei(uniswapDATA.toString()))

            return uniswapDATA
        } catch (e) {
            // Uniswap Adaptor contract has probably reverted the transaction.
            // This can happen when the order size exhausts the uniswap exchange.
            // In this case an invalid price is returned, primarily to block
            // progression in the purchase flow.

            return BN('infinity')
        }
    }
    return BN('infinity')
}

export const validateBalanceForPurchase = async (price: BN, paymentCurrency: PaymentCurrency) => {
    const [ethBalance, dataBalance, daiBalance] = await getBalances()
    const ethPrice = await uniswapDATAtoETH(price.toString())
    const daiPrice = await uniswapDATAtoDAI(price.toString())
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
