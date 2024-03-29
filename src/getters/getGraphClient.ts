import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { getConfigForChain } from '~/shared/web3/config'
import { getChainConfigExtension } from './getChainConfigExtension'

const graphClients: Partial<Record<number, ApolloClient<NormalizedCacheObject>>> = {}

export function getGraphClient(chainId: number) {
    const graphClient =
        graphClients[chainId] ||
        new ApolloClient({
            uri: getGraphUrl(chainId),
            cache: new InMemoryCache(),
        })

    if (!graphClients[chainId]) {
        graphClients[chainId] = graphClient
    }

    return graphClient
}

function getGraphUrl(chainId: number): string {
    const { theGraphUrl: url } = getConfigForChain(chainId)

    const { networkSubgraphUrl: fallbackUrl, enforceLocalNetworkSubgraphUrl } =
        getChainConfigExtension(chainId)

    if (enforceLocalNetworkSubgraphUrl) {
        return fallbackUrl
    }

    return url || fallbackUrl
}

const dataUnionGraphClients: Partial<
    Record<number, ApolloClient<NormalizedCacheObject>>
> = {}

export function getDataUnionGraphClient(chainId: number) {
    const { dataunionGraphNames } = getChainConfigExtension(chainId)

    const item = dataunionGraphNames.find((i) => i.chainId === chainId)

    if (typeof item?.name !== 'string') {
        throw new Error(`No dataunionGraphNames defined in config for chain ${chainId}!`)
    }

    const { networkSubgraphUrl } = getChainConfigExtension(chainId)

    const { origin } = new URL(networkSubgraphUrl)

    const client =
        dataUnionGraphClients[chainId] ||
        new ApolloClient({
            uri: `${origin}/subgraphs/name/${item.name}`,
            cache: new InMemoryCache(),
        })

    if (!dataUnionGraphClients[chainId]) {
        dataUnionGraphClients[chainId] = client
    }

    return client
}

const indexerGraphClients: Partial<Record<number, ApolloClient<NormalizedCacheObject>>> =
    {}

export function getIndexerClient(chainId: number) {
    const uri = getChainConfigExtension(chainId).streamIndexerUrl

    if (!uri) {
        return null
    }

    const client =
        indexerGraphClients[chainId] ||
        new ApolloClient({
            uri,
            cache: new InMemoryCache(),
        })

    if (!indexerGraphClients[chainId]) {
        indexerGraphClients[chainId] = client
    }

    return client
}
