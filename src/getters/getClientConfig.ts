import { ChainConnectionInfo, StreamrClientConfig } from '@streamr/sdk'
import formatConfigUrl from '~/utils/formatConfigUrl'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'
import { getGraphUrl } from './getGraphClient'

export default function getClientConfig(
    chainId: number,
    mods: any = {},
): StreamrClientConfig {
    const chainConfig = getChainConfig(chainId)

    const config: StreamrClientConfig = {
        metrics: false,
    }

    // Set network entrypoints if provided
    if (chainConfig.entryPoints && chainConfig.entryPoints.length > 0) {
        config.network = {
            controlLayer: {
                entryPoints: chainConfig.entryPoints,
            },
        }
    }

    config.contracts = {
        theGraphUrl: getGraphUrl(chainId),
        streamRegistryChainAddress: chainConfig.contracts.StreamRegistry,
        streamStorageRegistryChainAddress: chainConfig.contracts.StreamStorageRegistry,
    }

    if (chainConfig.rpcEndpoints) {
        config.contracts.streamRegistryChainRPCs = formatRpc({
            chainId: chainConfig.id,
            rpcs: chainConfig.rpcEndpoints,
        })
    }

    return {
        ...config,
        ...mods,
    }
}

interface Rpc {
    chainId: number
    rpcs: { readonly url: string }[]
}

function formatRpc({ chainId, rpcs, ...rest }: Rpc): ChainConnectionInfo {
    const { dockerHost } = getChainConfigExtension(chainId)

    return {
        ...rest,
        chainId,
        rpcs: rpcs.map(({ url }) => ({
            url: formatConfigUrl(url, {
                dockerHost,
            }),
        })),
    }
}
