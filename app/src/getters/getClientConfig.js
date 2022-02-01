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
            factoryMainnetAddress: client?.mainchain?.dataUnion?.factoryAddress || dataUnion?.factoryMainnetAddress,
            templateMainnetAddress: client?.mainchain?.dataUnion?.templateAddress || dataUnion?.templateMainnetAddress,
            factorySidechainAddress: client?.sidechain?.dataUnion?.factoryAddress || dataUnion?.factorySidechainAddress,
            templateSidechainAddress: client?.sidechain?.dataUnion?.templateAddress || dataUnion?.templateSidechainAddress,
            ...mods.dataUnion,
        },
        dataUnionChainRPC: formatRpc(client?.sidechain?.rpc) || DEFAULTS.dataUnionChainRPC,
        mainChainRPC: formatRpc(client?.mainchain?.rpc) || DEFAULTS.mainChainRPC,
        network: {
            ...DEFAULTS.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULTS.network?.trackers,
        },
        restUrl: formatConfigUrl(client?.restUrl) || DEFAULTS.restUrl,
        streamRegistryChainRPC: formatRpc(client?.sidechain?.rpc) || DEFAULTS.streamRegistryChainRPC,
        streamrNodeAddress: client?.streamrNodeAddress || DEFAULTS.streamrNodeAddress,
        theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULTS.theGraphUrl,
        tokenAddress: client?.mainchain?.dataTokenAddress || DEFAULTS.tokenAddress,
        tokenSidechainAddress: client?.sidechain?.dataTokenAddress || DEFAULTS.tokenSidechainAddress,
        verifySignatures: 'never',
        ...mods,
    }
}
