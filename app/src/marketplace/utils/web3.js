// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'

import NoBalanceError from '$mp/errors/NoBalanceError'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import type { SmartContractCall, Address } from '$shared/flowtype/web3-types'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import type { PaymentCurrency } from '$shared/flowtype/common-types'
import { getConfigForChain } from '$shared/web3/config'
import getChainId from '$utils/web3/getChainId'
import tokenAbi from '$shared/web3/abis/token'
import marketplaceAbi from '$shared/web3/abis/marketplace'
import uniswapAdaptorAbi from '$shared/web3/abis/uniswapAdaptor'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { getContract, call } from '../utils/smartContract'
import { fromAtto, fromDecimals } from './math'

declare var ethereum: Web3

const UNISWAP_SAFETY_MARGIN = 1.05
const ETH = '0x0000000000000000000000000000000000000000'

export const getDaiAddress = (chainId: number) => {
    // Not available in @streamr/config yet
    switch (chainId) {
        case 1:
            return '0x6B175474E89094C44Da98b954EedeAC495271d0F'
        case 137:
            return '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
        case 8995:
            // OTHERcoin in docker mainchain
            return '0x642D2B84A32A9A92FEc78CeAA9488388b3704898'
        case 8997:
            // LINK token works for now on sidechain
            return '0x3387F44140ea19100232873a5aAf9E46608c791E'
        default:
            console.error(`No Dai address found for chainId ${chainId}`)
            throw new Error(`No Dai address found for chainId ${chainId}`)
    }
}

export const getDataAddress = (chainId: number) => {
    const { contracts } = getConfigForChain(chainId)
    const dataTokenAddress = contracts.DATA
    if (dataTokenAddress == null) {
        throw new Error('No contract address for DATA token provided!')
    }
    return dataTokenAddress
}

export const getMarketplaceAddress = (chainId: number) => {
    const { contracts } = getConfigForChain(chainId)
    const marketplaceAddress = contracts.MarketplaceV3 || contracts.Marketplace
    if (marketplaceAddress == null) {
        throw new Error('No contract address for Marketplace provided!')
    }
    return marketplaceAddress
}

export const getMarketplaceAbiAndAddress = (chainId: number) => ({
    abi: marketplaceAbi,
    address: getMarketplaceAddress(chainId),
})

export const marketplaceContract = (usePublicNode: boolean = false, chainId: number) => (
    getContract(getMarketplaceAbiAndAddress(chainId), usePublicNode, chainId)
)

export const getDataTokenAbiAndAddress = (chainId: number) => ({
    abi: tokenAbi,
    address: getDataAddress(chainId),
})

export const dataTokenContractMethods = (usePublicNode: boolean = false, chainId: number) => (
    getContract(getDataTokenAbiAndAddress(chainId), usePublicNode, chainId).methods
)

export const daiTokenContractMethods = (usePublicNode: boolean = false, chainId: number) => {
    const instance = {
        abi: tokenAbi,
        address: getDaiAddress(chainId),
    }
    return getContract(instance, usePublicNode, chainId).methods
}

export const erc20TokenContractMethods = (address: Address, usePublicNode: boolean = false, chainId: number) => {
    const instance = {
        abi: tokenAbi,
        address,
    }
    return getContract(instance, usePublicNode, chainId).methods
}

export const uniswapAdaptorContractMethods = (usePublicNode: boolean = false, chainId: number) => {
    const { contracts } = getConfigForChain(chainId)
    const uniswapAdapterAddress = contracts.UniswapAdapter
    const instance = {
        abi: uniswapAdaptorAbi,
        address: uniswapAdapterAddress,
    }
    return getContract(instance, usePublicNode, chainId).methods
}

export const getNativeTokenBalance = (address: Address, usePublicNode: boolean = false): Promise<BN> => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()

    return web3.eth.getBalance(address)
        .then((balance) => BN(balance))
        .then(fromAtto)
}

export const getDataTokenBalance = (address: Address, usePublicNode: boolean = false, chainId: number): SmartContractCall<BN> => (
    call(dataTokenContractMethods(usePublicNode, chainId).balanceOf(address))
        .then(fromAtto)
)

export const getDaiTokenBalance = (address: Address, usePublicNode: boolean = false, chainId: number): SmartContractCall<BN> => (
    call(daiTokenContractMethods(usePublicNode, chainId).balanceOf(address))
        .then(fromAtto)
)

export const getCustomTokenBalance = async (
    contractAddress: Address,
    userAddress: Address,
    usePublicNode: boolean = false,
    chainId: number,
): SmartContractCall<BN> => {
    const balance = await call(erc20TokenContractMethods(contractAddress, usePublicNode, chainId).balanceOf(userAddress))
    const decimals = await call(erc20TokenContractMethods(contractAddress, usePublicNode, chainId).decimals())
    return fromDecimals(balance, decimals)
}

export const getCustomTokenDecimals = async (
    contractAddress: Address,
    chainId: number,
): SmartContractCall<BN> => {
    const decimals = await call(erc20TokenContractMethods(contractAddress, true, chainId).decimals())
    return BN(decimals)
}

export const getMyNativeTokenBalance = (): Promise<BN> => (getDefaultWeb3Account()
    .then((myAccount) => getNativeTokenBalance(myAccount))
)

export const getMyDataTokenBalance = async (): SmartContractCall<BN> => {
    const myAccount = await getDefaultWeb3Account()
    const chainId = await getChainId()
    return getDataTokenBalance(myAccount, false, chainId)
}

export const getMyDaiTokenBalance = async (): SmartContractCall<BN> => {
    const myAccount = await getDefaultWeb3Account()
    const chainId = await getChainId()
    return getDaiTokenBalance(myAccount, false, chainId)
}

export const getMyCustomTokenBalance = async (pricingTokenAddress: Address): SmartContractCall<BN> => {
    const myAccount = await getDefaultWeb3Account()
    const chainId = await getChainId()
    return getCustomTokenBalance(pricingTokenAddress, myAccount, false, chainId)
}

const tokenInformationCache = {}

export const getTokenInformation = async (address: Address, chainId?: number): Promise<?Object> => {
    const actualChainId = chainId || await getChainId()

    // Check from cache first
    const cacheKey = `${address ? address.toString() : 'noaddress'}-${actualChainId ? actualChainId.toString() : 'nochainid'}`
    const cacheItem = tokenInformationCache[cacheKey]
    if (cacheItem) {
        return cacheItem
    }

    try {
        const contract = erc20TokenContractMethods(address, true, actualChainId)
        const symbol = await contract.symbol().call()
        const name = await contract.name().call()
        const decimals = await contract.decimals().call()

        const infoObj = {
            symbol,
            name,
            decimals,
        }

        tokenInformationCache[cacheKey] = infoObj
        return infoObj
    } catch (e) {
        return null
    }
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
            const chainId = await getChainId()

            let uniswapETH = await call(uniswapAdaptorContractMethods(usePublicNode, chainId)
                .getConversionRateOutput(ETH, getDataAddress(chainId), productPriceDATA))
            uniswapETH = BN(web3.utils.fromWei(uniswapETH.toString()))

            return uniswapETH
        } catch (e) {
            // Uniswap Adaptor contract has probably reverted the transaction.
            // This can happen when the order size exhausts the uniswap exchange.
            // In this case an invalid price is returned, primarily to block
            // progression in the purchase flow.
            console.error(e)
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
            const chainId = await getChainId()

            let uniswapDAI = await call(uniswapAdaptorContractMethods(usePublicNode, chainId)
                .getConversionRateOutput(getDaiAddress(chainId), getDataAddress(chainId), productPriceDATA))
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
            const chainId = await getChainId()

            let uniswapDATA = await call(uniswapAdaptorContractMethods(usePublicNode, chainId)
                .getConversionRateOutput(getDataAddress(chainId), ETH, ethWei))
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
    pricingTokenAddress: Address,
    includeGasForSetAllowance?: boolean,
    includeGasForResetAllowance?: boolean,
}

/* eslint-disable object-curly-newline */
export const validateBalanceForPurchase = async ({
    price,
    paymentCurrency,
    pricingTokenAddress,
    includeGasForSetAllowance = false,
    includeGasForResetAllowance = false,
}: ValidateBalance) => {
    const nativeTokenBalance = await getMyNativeTokenBalance()
    let requiredGas = fromAtto(gasLimits.BUY_PRODUCT)

    if (includeGasForSetAllowance) {
        requiredGas = requiredGas.plus(fromAtto(gasLimits.APPROVE))
    }

    if (includeGasForResetAllowance) {
        requiredGas = requiredGas.plus(fromAtto(gasLimits.APPROVE))
    }

    switch (paymentCurrency) {
        case paymentCurrencies.PRODUCT_DEFINED: {
            const tokenBalance = await getMyCustomTokenBalance(pricingTokenAddress)
            if (nativeTokenBalance.isLessThan(requiredGas) || tokenBalance.isLessThan(price)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
                    required: {
                        gas: requiredGas,
                        productToken: price,
                    },
                    balances: {
                        native: nativeTokenBalance,
                        productToken: tokenBalance,
                    },
                })
            }
            break
        }
        case paymentCurrencies.ETH: {
            const ethPrice = await uniswapDATAtoETH(price.toString())
            const requiredEth = BN(ethPrice).plus(requiredGas)
            if (nativeTokenBalance.isLessThan(requiredEth)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
                    required: {
                        gas: requiredGas,
                        native: requiredEth,
                    },
                    balances: {
                        native: nativeTokenBalance,
                    },
                })
            }
            break
        }
        case paymentCurrencies.DATA: {
            const dataBalance = await getMyDataTokenBalance()
            if (nativeTokenBalance.isLessThan(requiredGas) || dataBalance.isLessThan(price)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
                    required: {
                        gas: requiredGas,
                        data: price,
                    },
                    balances: {
                        native: nativeTokenBalance,
                        data: dataBalance,
                    },
                })
            }
            break
        }
        case paymentCurrencies.DAI: {
            const daiBalance = await getMyDaiTokenBalance()
            const daiPrice = await uniswapDATAtoDAI(price.toString())
            if (nativeTokenBalance.isLessThan(requiredGas) || daiBalance.isLessThan(daiPrice)) {
                throw new NoBalanceError({
                    message: 'It looks like you don’t have enough balance to subscribe to this product.',
                    required: {
                        gas: requiredGas,
                        dai: price,
                    },
                    balances: {
                        native: nativeTokenBalance,
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
