import { ChainConnectionInfo, StreamrClientConfig } from '@streamr/sdk'
import formatConfigUrl from '~/utils/formatConfigUrl'
import { getConfigForChain } from '~/shared/web3/config'
import { getChainConfigExtension } from './getChainConfigExtension'
import { getGraphUrl } from './getGraphClient'

export default function getClientConfig(
    chainId: number,
    mods: any = {},
): StreamrClientConfig {
    const chainConfig = getConfigForChain(chainId)
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

    const websocketHost = process.env.ENTRYPOINT_WS_HOST

    if (websocketHost && config.network?.controlLayer?.entryPoints) {
        /**
         * Edge case for local dev envs which don't use entry point hosts
         * other than the default 10.200.10.1.
         */
        config.network.controlLayer.entryPoints.forEach((entryPoint) => {
            if (entryPoint.websocket?.host === '10.200.10.1') {
                entryPoint.websocket.host = websocketHost
            }
        })
    }

    const contracts: StreamrClientConfig['contracts'] = {}

    ;[
        {
            condition: !!chainConfig.contracts.StreamRegistry,
            key: 'streamRegistryChainAddress',
            value: chainConfig.contracts.StreamRegistry,
        },
        {
            condition: !!chainConfig.rpcEndpoints,
            key: 'streamRegistryChainRPCs',
            value: formatRpc({
                chainId: chainConfig.id,
                rpcs: chainConfig.rpcEndpoints,
            }),
        },
        {
            condition: !!chainConfig.contracts.StreamStorageRegistry,
            key: 'streamStorageRegistryChainAddress',
            value: chainConfig.contracts.StreamStorageRegistry,
        },
    ].forEach((configCase) => {
        if (configCase.condition) {
            contracts[configCase.key] = configCase.value
        }
    })

    contracts.theGraphUrl = getGraphUrl(chainId)

    config.contracts = contracts

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
