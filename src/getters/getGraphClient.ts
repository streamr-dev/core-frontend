import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import getCoreConfig from './getCoreConfig'
import { getCurrentChainId } from './getCurrentChain'
import { getGraphUrl } from '.'

const graphClients: Partial<Record<number, ApolloClient<NormalizedCacheObject>>> = {}

export function getGraphClient() {
    const chainId = getCurrentChainId()

    const graphClient =
        graphClients[chainId] ||
        new ApolloClient({
            uri: getGraphUrl(),
            cache: new InMemoryCache(),
        })

    if (!graphClients[chainId]) {
        graphClients[chainId] = graphClient
    }

    return graphClient
}

const dataUnionGraphClients: Partial<
    Record<number, ApolloClient<NormalizedCacheObject>>
> = {}

export function getDataUnionGraphClient(chainId: number) {
    const map: { chainId: unknown; name: unknown }[] = getCoreConfig().dataunionGraphNames

    const item = map.find((i) => i.chainId === chainId)

    if (typeof item?.name !== 'string') {
        throw new Error(`No dataunionGraphNames defined in config for chain ${chainId}!`)
    }

    const client =
        dataUnionGraphClients[chainId] ||
        new ApolloClient({
            uri: `${getCoreConfig().theGraphUrl}/subgraphs/name/${item.name}`,
            cache: new InMemoryCache(),
        })

    if (!dataUnionGraphClients[chainId]) {
        dataUnionGraphClients[chainId] = client
    }

    return client
}
