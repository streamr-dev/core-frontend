import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { getConfigForChain } from '~/shared/web3/config'
import { getERC20TokenContract } from '~/getters'
import { fromDecimals } from './math'

export const getDataAddress = (chainId: number): string => {
    const { contracts } = getConfigForChain(chainId)
    const dataTokenAddress = contracts.DATA

    if (dataTokenAddress == null) {
        throw new Error('No contract address for DATA token provided!')
    }

    return dataTokenAddress
}

export const getMarketplaceAddress = (chainId: number): string => {
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

export const getNativeTokenBalance = async (userAddress: string, chainId: number) => {
    const provider = getPublicWeb3Provider(chainId)
    const balance = await provider.getBalance(userAddress)
    return balance
}

export const getCustomTokenBalance = async (
    contractAddress: string,
    userAddress: string,
    chainId: number,
) => {
    const contract = getERC20TokenContract({
        tokenAddress: contractAddress,
        provider: getPublicWeb3Provider(chainId),
    })

    const balance = await contract.balanceOf(userAddress)

    const decimals = await contract.decimals()

    return fromDecimals(balance, decimals)
}
