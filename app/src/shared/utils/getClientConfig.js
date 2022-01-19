import { ConfigTest } from 'streamr-client'

import isProduction from '$mp/utils/isProduction'
import { getWeb3 } from '$shared/web3/web3Provider'

export default function getClientConfig(options = {}) {
    const web3 = getWeb3()

    const config = Object.assign({
        ...(!isProduction() ? ConfigTest : {}),
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        theGraphUrl: `${process.env.THE_GRAPH_API_URL}/subgraphs/name/streamr-dev/network-contracts`,
        verifySignatures: 'never',
        auth: {
            ethereum: web3.metamaskProvider,
        },
        mainChainRPC: {
            url: process.env.MAINNET_HTTP_PROVIDER,
        },
        dataUnionChainRPC: {
            url: process.env.DATAUNIONS_HTTP_PROVIDER,
            chainId: parseInt(process.env.DATAUNIONS_CHAIN_ID, 10),
        },
        streamRegistryChainRPC: {
            url: process.env.STREAMS_HTTP_PROVIDER,
            chainId: parseInt(process.env.STREAMS_CHAIN_ID, 10),
        },
    }, options)

    return config
}
