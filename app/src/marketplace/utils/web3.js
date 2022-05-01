// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'

import NoBalanceError from '$mp/errors/NoBalanceError'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import getConfig from '$shared/web3/config'
import type { SmartContractCall, Address } from '$shared/flowtype/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import type { PaymentCurrency } from '$shared/flowtype/common-types'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { getContract, call } from '../utils/smartContract'
import { fromAtto } from './math'

declare var ethereum: Web3

const UNISWAP_SAFETY_MARGIN = 1.05
const ETH = '0x0000000000000000000000000000000000000000'
const { daiTokenContractAddress: DAI } = getCoreConfig()
const { tokenAddress: DATA } = getClientConfig()

const dataTokenContractMethods = (usePublicNode: boolean = false) => {
    const { mainnet } = getConfig()

    return getContract(mainnet.dataToken, usePublicNode).methods
}

const daiTokenContractMethods = (usePublicNode: boolean = false) => {
    const { mainnet } = getConfig()

    return getContract(mainnet.daiToken, usePublicNode).methods
}

const uniswapAdaptorMethods = (usePublicNode: boolean = false) => {
    const { mainnet } = getConfig()

    return getContract(mainnet.uniswapAdaptor, usePublicNode).methods
}

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

export const getMyEthBalance = (): Promise<BN> => (getDefaultWeb3Account()
    .then((myAccount) => getEthBalance(myAccount))
)

export const getMyDataTokenBalance = (): SmartContractCall<BN> => (getDefaultWeb3Account()
    .then((myAccount) => getDataTokenBalance(myAccount))
)

export const getMyDaiTokenBalance = (): SmartContractCall<BN> => (getDefaultWeb3Account()
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

            let uniswapETH = await call(uniswapAdaptorMethods(usePublicNode).getConversionRateOutput(ETH, DATA, productPriceDATA))
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

            let uniswapDAI = await call(uniswapAdaptorMethods(usePublicNode).getConversionRateOutput(DAI, DATA, productPriceDATA))
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

            let uniswapDATA = await call(uniswapAdaptorMethods(usePublicNode).getConversionRateOutput(DATA, ETH, ethWei))
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

type ValidateBalance = {
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
}: ValidateBalance) => {
    const [ethBalance, dataBalance, daiBalance] = await getBalances()
    let requiredGas = fromAtto(gasLimits.BUY_PRODUCT)

    if (includeGasForSetAllowance) {
        requiredGas = requiredGas.plus(fromAtto(gasLimits.APPROVE))
    }

    if (includeGasForResetAllowance) {
        requiredGas = requiredGas.plus(fromAtto(gasLimits.APPROVE))
    }

    switch (paymentCurrency) {
        case paymentCurrencies.ETH: {
            const ethPrice = await uniswapDATAtoETH(price.toString())
            const requiredEth = BN(ethPrice).plus(requiredGas)
            if (ethBalance.isLessThan(requiredEth)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
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
        case paymentCurrencies.DATA: {
            if (ethBalance.isLessThan(requiredGas) || dataBalance.isLessThan(price)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
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
        }
        case paymentCurrencies.DAI: {
            const daiPrice = await uniswapDATAtoDAI(price.toString())
            if (ethBalance.isLessThan(requiredGas) || daiBalance.isLessThan(daiPrice)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
                    required: {
                        gas: requiredGas,
                        dai: price,
                    },
                    balances: {
                        eth: ethBalance,
                        dai: daiBalance,
                    },
                })
            }
            break
        }
        default:
            break
    }
}
/* eslint-enable object-curly-newline */
