import { StreamrClientConfig } from 'streamr-client'
import formatConfigUrl from '~/utils/formatConfigUrl'
import formatRpc from '~/utils/formatRpc'
import getConfig from '~/getters/getConfig'
import { defaultChainConfig } from '~/getters/getChainConfig'

export default function getClientConfig(mods: any = {}): StreamrClientConfig {
    const { client } = getConfig()
    const config: StreamrClientConfig = {
        metrics: false,
    }

    // TODO: This should be available in @streamr/config soonish
    if (defaultChainConfig.name === 'mumbai') {
        mods = {
            network: {
                controlLayer: {
                    entryPoints: [
                        {
                            id: 'e1',
                            websocket: {
                                host: 'entrypoint-1.streamr.network',
                                port: 40401,
                                tls: true,
                            },
                        },
                        {
                            id: 'e2',
                            websocket: {
                                host: 'entrypoint-2.streamr.network',
                                port: 40401,
                                tls: true,
                            },
                        },
                    ],
                },
            },
        }
    }

    const contracts: StreamrClientConfig['contracts'] = {}
    ;[
        {
            condition: !!defaultChainConfig.rpcEndpoints,
            key: 'mainChainRPCs',
            value: formatRpc({
                chainId: defaultChainConfig.id,
                rpcs: defaultChainConfig.rpcEndpoints,
            }),
        },
        {
            condition: !!defaultChainConfig.contracts.StreamRegistry,
            key: 'streamRegistryChainAddress',
            value: defaultChainConfig.contracts.StreamRegistry,
        },
        {
            condition: !!defaultChainConfig.rpcEndpoints,
            key: 'streamRegistryChainRPCs',
            value: formatRpc({
                chainId: defaultChainConfig.id,
                rpcs: defaultChainConfig.rpcEndpoints,
            }),
        },
        {
            condition: !!defaultChainConfig.contracts.StreamStorageRegistry,
            key: 'streamStorageRegistryChainAddress',
            value: defaultChainConfig.contracts.StreamStorageRegistry,
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
    console.log({ ...config, ...mods })
    return {
        ...config,
        ...mods,
    }
}
