import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import getCoreConfig from './getCoreConfig'
import { getGraphUrl } from '.'

let graphClient: ApolloClient<NormalizedCacheObject> | undefined

export default function getGraphClient() {
    if (!graphClient) {
        graphClient = new ApolloClient({
            uri: getGraphUrl(),
            cache: new InMemoryCache(),
        })
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
