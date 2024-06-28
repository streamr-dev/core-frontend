import { StreamrClientConfig } from '@streamr/sdk'
import { getChainConfig } from '~/utils/chains'
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
        ethereumNetwork: {
            chainId,
        },
        rpcs: chainConfig.rpcEndpoints,
        streamRegistryChainAddress: chainConfig.contracts.StreamRegistry,
        streamStorageRegistryChainAddress: chainConfig.contracts.StreamStorageRegistry,
        theGraphUrl: getGraphUrl(chainId),
    }

    return {
        ...config,
        ...mods,
    }
}
