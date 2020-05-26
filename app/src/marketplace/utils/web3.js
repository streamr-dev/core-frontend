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

const UNISWAP_SAFETY_MARGIN = 1.05
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

type GetPrice = {
    price: BN,
    paymentCurrency: PaymentCurrency,
    includeGasForSetAllowance?: boolean,
    includeGasForResetAllowance?: boolean,
}

/* eslint-disable object-curly-newline */
export const validateBalanceForPurchase = async ({
    price,
    paymentCurrency,
    includeGasForSetAllowance = false,
    includeGasForResetAllowance = false,
}: GetPrice) => {
/* eslint-enable object-curly-newline */
    const [ethBalance, dataBalance, daiBalance] = await getBalances()
    const ethPrice = await uniswapDATAtoETH(price.toString())
    const daiPrice = await uniswapDATAtoDAI(price.toString())
    let requiredGas = fromAtto(gasLimits.BUY_PRODUCT)

    if (includeGasForSetAllowance) {
        requiredGas = requiredGas.plus(gasLimits.APPROVE)
    }

    if (includeGasForResetAllowance) {
        requiredGas = requiredGas.plus(gasLimits.APPROVE)
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH: {
            const requiredEth = BN(ethPrice).plus(requiredGas)
            if (ethBalance.isLessThan(requiredEth)) {
                throw new NoBalanceError({
                    message: I18n.t('error.noBalance'),
                    required: {
                        gas: requiredGas,
                        eth: requiredEth,
                    },
                    balances: {
                        eth: ethBalance,
                    },
                })
            }
            break
        }
        case paymentCurrencies.DATA:
            if (ethBalance.isLessThan(requiredGas) || dataBalance.isLessThan(price)) {
                throw new NoBalanceError({
                    message: I18n.t('error.noBalance'),
                    required: {
                        gas: requiredGas,
                        data: price,
                    },
                    balances: {
                        eth: ethBalance,
                        data: dataBalance,
                    },
                })
            }
            break
        case paymentCurrencies.DAI:
            if (ethBalance.isLessThan(requiredGas) || daiBalance.isLessThan(daiPrice)) {
                throw new NoBalanceError({
                    message: I18n.t('error.noBalance'),
                    required: {
                        gas: requiredGas,
                        dai: daiPrice,
                    },
                    balances: {
                        eth: ethBalance,
                        dai: daiBalance,
                    },
                })
            }
            break
        default:
            break
    }
}
