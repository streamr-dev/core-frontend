import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { getConfigForChain } from '~/shared/web3/config'
import getCoreConfig from '~/getters/getCoreConfig'
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
    const chain = getConfigForChain(chainId)

    if (chain.theGraphUrl != null) {
        return chain.theGraphUrl
    }

    // Fall back to default subgraph name
    const { networkSubgraphUrl: url } = getChainConfigExtension(chainId)

    console.warn('There is no theGraphUrl in config. Falling back to', url)

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
