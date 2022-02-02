import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import config from '$config'

export default function getClientConfig(mods = {}) {
    const { client } = config

    const { dataUnion, ensCacheChainAddress, ...DEFAULTS } = STREAM_CLIENT_DEFAULTS

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
        dataUnionChainRPC: formatRpc(client?.dataUnionChain?.rpc) || DEFAULTS.dataUnionChainRPC,
        mainChainRPC: formatRpc(client?.mainchain?.rpc) || DEFAULTS.mainChainRPC,
        network: {
            ...DEFAULTS.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULTS.network?.trackers,
        },
        nodeRegistryChainAddress: client?.storageNodeRegistryContractAddress || DEFAULTS.nodeRegistryChainAddress,
        restUrl: formatConfigUrl(client?.restUrl) || DEFAULTS.restUrl,
        streamRegistryChainAddress: client?.streamRegistryContractAddress || DEFAULTS.streamRegistryChainAddress,
        streamRegistryChainRPC: formatRpc(client?.streamRegistryChain?.rpc) || DEFAULTS.streamRegistryChainRPC,
        streamrNodeAddress: client?.streamrNodeAddress || DEFAULTS.streamrNodeAddress,
        streamStorageRegistryChainAddress: client?.streamStorageRegistryContractAddress || DEFAULTS.streamStorageRegistryChainAddress,
        theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULTS.theGraphUrl,
        tokenAddress: client?.mainchain?.dataTokenAddress || DEFAULTS.tokenAddress,
        tokenSidechainAddress: client?.sidechain?.dataTokenAddress || DEFAULTS.tokenSidechainAddress,
        verifySignatures: 'never',
        ...mods,
    }
}
