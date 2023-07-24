import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'

let graphClient: ApolloClient<NormalizedCacheObject> | undefined

export default function getGraphClient() {
    if (!graphClient) {
        graphClient = new ApolloClient({
            uri:
                process.env.NETWORK_GRAPH_SCHEMA_PATH ||
                'http://localhost:8000/subgraphs/name/streamr-dev/network-subgraphs',
            cache: new InMemoryCache(),
        })
    }

    return graphClient
}
