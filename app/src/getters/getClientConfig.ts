import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import getConfig from '$app/src/getters/getConfig'
// TODO add typing
export default function getClientConfig(mods: any = {}): any {
    const { client } = getConfig()

    const { ensCacheChainAddress, ...DEFAULTS } = STREAM_CLIENT_DEFAULTS

    return {
        ...DEFAULTS,
        mainChainRPCs: formatRpc(client?.mainchain?.rpc) || DEFAULTS.mainChainRPCs,
        network: {
            ...DEFAULTS.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULTS.network?.trackers,
        },
        streamRegistryChainAddress: client?.streamRegistryChainAddress || DEFAULTS.streamRegistryChainAddress,
        streamRegistryChainRPCs: formatRpc(client?.streamRegistryChain?.rpc) || DEFAULTS.streamRegistryChainRPCs,
        streamStorageRegistryChainAddress: client?.streamStorageRegistryChainAddress || DEFAULTS.streamStorageRegistryChainAddress,
        theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULTS.theGraphUrl,
        metrics: false,
        ...mods,
    }
}
