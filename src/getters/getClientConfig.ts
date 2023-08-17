import { StreamrClientConfig } from 'streamr-client'
import formatConfigUrl from '~/utils/formatConfigUrl'
import formatRpc from '~/utils/formatRpc'
import formatTrackers from '~/utils/formatTrackers'
import getConfig from '~/getters/getConfig'
import { defaultChainConfig } from '~/getters/getChainConfig'

export default function getClientConfig(mods: any = {}): StreamrClientConfig {
    const { client } = getConfig()
    const config: StreamrClientConfig = {
        metrics: false,
    }
    if (client?.network?.trackers) {
        config.network = {
            trackers: formatTrackers(client?.network?.trackers),
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
    return {
        ...config,
        ...mods,
    }
}
