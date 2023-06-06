import { StreamrClientConfig } from 'streamr-client'
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import getConfig from '$app/src/getters/getConfig'

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
            condition: !!client?.mainchain?.rpc,
            key: 'mainChainRPCs',
            value: formatRpc(client?.mainchain?.rpc),
        },
        {
            condition: !!client?.streamRegistryChainAddress,
            key: 'streamRegistryChainAddress',
            value: client?.streamRegistryChainAddress,
        },
        {
            condition: !!client?.streamRegistryChain?.rpc,
            key: 'streamRegistryChainRPCs',
            value: formatRpc(client?.streamRegistryChain?.rpc),
        },
        {
            condition: !!client?.streamStorageRegistryChainAddress,
            key: 'streamStorageRegistryChainAddress',
            value: client?.streamStorageRegistryChainAddress,
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
