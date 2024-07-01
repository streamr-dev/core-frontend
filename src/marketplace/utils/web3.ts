import { getChainConfig } from '~/utils/chains'

export const getDataAddress = (chainId: number): string => {
    const { contracts } = getChainConfig(chainId)
    const dataTokenAddress = contracts.DATA

    if (dataTokenAddress == null) {
        throw new Error('No contract address for DATA token provided!')
    }

    return dataTokenAddress
}

export const getMarketplaceAddress = (chainId: number): string => {
    const { contracts } = getChainConfig(chainId)
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
