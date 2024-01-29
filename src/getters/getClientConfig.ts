import { StreamrClientConfig } from 'streamr-client'
import formatConfigUrl from '~/utils/formatConfigUrl'
import formatRpc from '~/utils/formatRpc'
import getConfig from '~/getters/getConfig'
import { getConfigForChain } from '~/shared/web3/config'

export default function getClientConfig(
    chainId: number,
    mods: any = {},
): StreamrClientConfig {
    const chainConfig = getConfigForChain(chainId)
    const { client } = getConfig()
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
        {
            condition: !!client?.graphUrl,
            key: 'theGraphUrl',
            value: formatConfigUrl(client?.graphUrl),
        },
    ].forEach((configCase) => {
        if (configCase.condition) {
            contracts[configCase.key] = configCase.value
        }
    })
    if (Object.keys(contracts).length > 0) {
        config.contracts = contracts
    }
    return {
        ...config,
        ...mods,
    }
}
