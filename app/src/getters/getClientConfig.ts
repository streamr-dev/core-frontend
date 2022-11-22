import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import getConfig from '$app/src/getters/getConfig'
// TODO add typing
export default function getClientConfig(mods: any = {}): any {
    const { client } = getConfig()

    const { ...DEFAULTS } = STREAM_CLIENT_DEFAULTS

    return {
        ...DEFAULTS,
        network: {
            ...DEFAULTS.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULTS.network?.trackers,
        },
        contracts: {
            ...DEFAULTS.contracts,
            mainChainRPCs: formatRpc(client?.mainchain?.rpc) || DEFAULTS.contracts.mainChainRPCs,
            streamRegistryChainAddress: client?.streamRegistryChainAddress || DEFAULTS.contracts.streamRegistryChainAddress,
            streamRegistryChainRPCs: formatRpc(client?.streamRegistryChain?.rpc) || DEFAULTS.contracts.streamRegistryChainRPCs,
            streamStorageRegistryChainAddress: client?.streamStorageRegistryChainAddress || DEFAULTS.contracts.streamStorageRegistryChainAddress,
            theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULTS.contracts.theGraphUrl,
        },
        metrics: false,
        ...mods,
    }
}
