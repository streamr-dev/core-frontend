import { getPublicWeb3Provider, getWalletWeb3Provider } from '~/shared/stores/wallet'
import { Address } from '~/shared/types/web3-types'
import { getConfigForChain } from '~/shared/web3/config'
import getChainId from '~/utils/web3/getChainId'
import { getERC20TokenContract } from '~/getters'
import { BNish } from '~/utils/bn'
import { fromDecimals } from './math'

export const getDataAddress = (chainId: number): Address => {
    const { contracts } = getConfigForChain(chainId)
    const dataTokenAddress = contracts.DATA

    if (dataTokenAddress == null) {
        throw new Error('No contract address for DATA token provided!')
    }

    return dataTokenAddress
}

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

export const getCustomTokenBalance = async (
    contractAddress: Address,
    userAddress: Address,
) => {
    const contract = getERC20TokenContract({
        tokenAddress: contractAddress,
        signer: await getWalletWeb3Provider(),
    })

    const balance = await contract.balanceOf(userAddress)

    const decimals = await contract.decimals()

    return fromDecimals(balance, decimals)
}

export type TokenInformation = {
    symbol: string
    name: string
    decimals: BNish
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

    const contract = getERC20TokenContract({
        tokenAddress: address,
        signer: getPublicWeb3Provider(actualChainId),
    })

    try {
        const symbol = await contract.symbol()

        if (symbol == null) {
            // This is not an ERC-20 token
            return null
        }

        const name = await contract.name()

        const decimals = await contract.decimals()

        const infoObj: TokenInformation = {
            symbol,
            name,
            decimals: Number(decimals),
        }
        tokenInformationCache[cacheKey] = infoObj
        return infoObj
    } catch (e) {
        console.warn('Failed to load token info', e)
    }

    return null
}
