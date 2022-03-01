import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import getConfig from '$app/src/getters/getConfig'

export default function getClientConfig(mods = {}) {
    const { client } = getConfig()

    const { dataUnion, ...DEFAULTS } = STREAM_CLIENT_DEFAULTS

    return {
        ...DEFAULTS,
        autoConnect: true,
        autoDisconnect: false,
        dataUnion: {
            ...dataUnion,
            factoryMainnetAddress: client?.dataUnion?.factoryMainnetAddress || dataUnion?.factoryMainnetAddress,
            templateMainnetAddress: client?.dataUnion?.templateMainnetAddress || dataUnion?.templateMainnetAddress,
            factorySidechainAddress: client?.dataUnion?.factorySidechainAddress || dataUnion?.factorySidechainAddress,
            templateSidechainAddress: client?.dataUnion?.templateSidechainAddress || dataUnion?.templateSidechainAddress,
            ...mods.dataUnion,
        },
        dataUnionChainRPCs: formatRpc(client?.dataUnionChain?.rpc) || DEFAULTS.dataUnionChainRPCs,
        mainChainRPCs: formatRpc(client?.mainchain?.rpc) || DEFAULTS.mainChainRPCs,
        network: {
            ...DEFAULTS.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULTS.network?.trackers,
        },
        restUrl: formatConfigUrl(client?.restUrl) || DEFAULTS.restUrl,
        streamRegistryChainAddress: client?.streamRegistryChainAddress || DEFAULTS.streamRegistryChainAddress,
        streamRegistryChainRPCs: formatRpc(client?.streamRegistryChain?.rpc) || DEFAULTS.streamRegistryChainRPCs,
        streamrNodeAddress: client?.streamrNodeAddress || DEFAULTS.streamrNodeAddress,
        streamStorageRegistryChainAddress: client?.streamStorageRegistryChainAddress || DEFAULTS.streamStorageRegistryChainAddress,
        theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULTS.theGraphUrl,
        tokenAddress: client?.mainchain?.dataTokenAddress || DEFAULTS.tokenAddress,
        tokenSidechainAddress: client?.sidechain?.dataTokenAddress || DEFAULTS.tokenSidechainAddress,
        verifySignatures: 'never',
        ...mods,
    }
}
