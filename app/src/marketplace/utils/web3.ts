import BN from 'bignumber.js'
import { AbiItem } from 'web3-utils'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import { SmartContractConfig } from '$shared/types/web3-types'
import { SmartContractCall, Address } from '$shared/types/web3-types'
import { getConfigForChain } from '$shared/web3/config'
import getChainId from '$utils/web3/getChainId'
import tokenAbi from '$shared/web3/abis/token.json'
import marketplaceAbi from '$shared/web3/abis/marketplace.json'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { getContract, call } from '../utils/smartContract'
import { fromAtto, fromDecimals } from './math'

export const getDataAddress = (chainId: number): Address => {
    const { contracts } = getConfigForChain(chainId)
    const dataTokenAddress = contracts.DATA

    if (dataTokenAddress == null) {
        throw new Error('No contract address for DATA token provided!')
    }

    return dataTokenAddress
}
export const dataTokenContractMethods = (usePublicNode = false, chainId: number): any =>
    getContract(getDataTokenAbiAndAddress(chainId), usePublicNode, chainId).methods

export const getDataTokenAbiAndAddress = (chainId: number): SmartContractConfig => ({
    abi: tokenAbi as AbiItem[],
    address: getDataAddress(chainId),
})

export const getMarketplaceAddress = (chainId: number): Address => {
    const { contracts } = getConfigForChain(chainId)
    // Use Marketplace or RemoteMarketplace depending on chain. MarketplaceV3 is just a fallback for tests (they run on "dev0" chain)
    const marketplaceAddress =
        contracts.MarketplaceV4 ||
        contracts.RemoteMarketplaceV1 ||
        contracts.MarketplaceV3

    if (marketplaceAddress == null) {
        throw new Error(
            'Could not find contract address for MarketplaceV4 or RemoteMarketplaceV1!',
        )
    }

    return marketplaceAddress
}
export const getMarketplaceAbiAndAddress = (chainId: number): SmartContractConfig => ({
    abi: marketplaceAbi as AbiItem[],
    address: getMarketplaceAddress(chainId),
})
/**
 * @deprecated Use `getERC20TokenContract(…).methods` explicitly.
 */
export const erc20TokenContractMethods = (
    address: Address,
    usePublicNode = false,
    chainId: number,
): any => {
    const instance: SmartContractConfig = {
        abi: tokenAbi as AbiItem[],
        address,
    }
    return getContract(instance, usePublicNode, chainId).methods
}

export const getNativeTokenBalance = (
    address: Address,
    usePublicNode = false,
): Promise<BN> => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    return web3.eth
        .getBalance(address)
        .then((balance) => new BN(balance))
        .then(fromAtto)
}
export const getDataTokenBalance = (
    address: Address,
    usePublicNode = false,
    chainId: number,
): SmartContractCall<BN> =>
    call(dataTokenContractMethods(usePublicNode, chainId).balanceOf(address)).then(
        fromAtto,
    )

export const getCustomTokenBalance = async (
    contractAddress: Address,
    userAddress: Address,
    usePublicNode = false,
    chainId: number,
): SmartContractCall<BN> => {
    const balance = await call(
        erc20TokenContractMethods(contractAddress, usePublicNode, chainId).balanceOf(
            userAddress,
        ),
    )
    const decimals = await call(
        erc20TokenContractMethods(contractAddress, usePublicNode, chainId).decimals(),
    )
    return fromDecimals(balance, decimals)
}
export const getMyNativeTokenBalance = (): Promise<BN> =>
    getDefaultWeb3Account().then((myAccount) => getNativeTokenBalance(myAccount))
export const getMyDataTokenBalance = async (): SmartContractCall<BN> => {
    const myAccount = await getDefaultWeb3Account()
    const chainId = await getChainId()
    return getDataTokenBalance(myAccount, false, chainId)
}

type TokenInformation = {
    symbol: string
    name: string
    decimals: number
}
const tokenInformationCache: Record<string, TokenInformation> = {}
export const getTokenInformation = async (
    address: Address,
    chainId?: number,
): Promise<TokenInformation | null | undefined> => {
    const actualChainId = chainId || (await getChainId())
    // Check from cache first
    const cacheKey = `${address ? address.toString().toLowerCase() : 'noaddress'}-${
        actualChainId ? actualChainId.toString() : 'nochainid'
    }`
    const cacheItem = tokenInformationCache[cacheKey]

    if (cacheItem) {
        return cacheItem
    }

    try {
        const contract = erc20TokenContractMethods(address, true, actualChainId)
        const symbol = await contract.symbol().call()

        if (symbol == null) {
            // This is not an ERC-20 token
            return null
        }

        const name = await contract.name().call()
        const decimals = await contract.decimals().call()
        const infoObj: TokenInformation = {
            symbol,
            name,
            decimals: Number(decimals),
        }
        tokenInformationCache[cacheKey] = infoObj
        return infoObj
    } catch (e) {
        return null
    }
}
