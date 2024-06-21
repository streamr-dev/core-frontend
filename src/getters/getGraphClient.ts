import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'

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

export function getGraphUrl(chainId: number): string {
    const { theGraphUrl: defaultUrl } = getChainConfig(chainId)

    const { networkSubgraphUrl: customUrl } = getChainConfigExtension(chainId)

    const url = customUrl || defaultUrl

    if (!url) {
        throw new Error(`Missing network subgraph url for chain ${chainId}`)
    }

    return url
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

    const networkSubgraphUrl = getGraphUrl(chainId)

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
