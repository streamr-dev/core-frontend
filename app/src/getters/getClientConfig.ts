import {StreamrClientConfig} from "streamr-client"
import formatConfigUrl from '$utils/formatConfigUrl'
import formatRpc from '$utils/formatRpc'
import formatTrackers from '$utils/formatTrackers'
import getConfig from '$app/src/getters/getConfig'

export const DEFAULT_CLIENT_CONFIG: StreamrClientConfig = {
    logLevel: 'info',
    orderMessages: true,
    gapFill: true,
    maxGapRequests: 5,
    retryResendAfter: 5000,
    gapFillTimeout: 5000,
    network: {
        acceptProxyConnections: false,
        trackers: {
            contractAddress: '0xab9BEb0e8B106078c953CcAB4D6bF9142BeF854d'
        },
        trackerPingInterval: 60 * 1000,
        trackerConnectionMaintenanceInterval: 5 * 1000,
        webrtcDisallowPrivateAddresses: true,
        newWebrtcConnectionTimeout: 15 * 1000,
        webrtcDatachannelBufferThresholdLow: 2 ** 15,
        webrtcDatachannelBufferThresholdHigh: 2 ** 17,
        webrtcSendBufferMaxMessageCount: 500,
        disconnectionWaitTime: 200,
        peerPingInterval: 30 * 1000,
        rttUpdateTimeout: 15 * 1000,
        iceServers: [
            {
                url: 'stun:stun.streamr.network',
                port: 5349
            },
            {
                url: 'turn:turn.streamr.network',
                port: 5349,
                username: 'BrubeckTurn1',
                password: 'MIlbgtMw4nhpmbgqRrht1Q=='
            },
            {
                url: 'turn:turn.streamr.network',
                port: 5349,
                username: 'BrubeckTurn1',
                password: 'MIlbgtMw4nhpmbgqRrht1Q==',
                tcp: true
            }
        ]
    },
    // For ethers.js provider params, see https://docs.ethers.io/ethers.js/v5-beta/api-providers.html#provider
    contracts: {
        streamRegistryChainAddress: '0x0D483E10612F327FC11965Fc82E90dC19b141641',
        streamStorageRegistryChainAddress: '0xe8e2660CeDf2a59C917a5ED05B72df4146b58399',
        storageNodeRegistryChainAddress: '0x080F34fec2bc33928999Ea9e39ADc798bEF3E0d6',
        mainChainRPCs: {
            name: 'ethereum',
            chainId: 1,
            rpcs: [
                {
                    url: 'https://eth-rpc.gateway.pokt.network',
                    timeout: 120 * 1000
                },
                {
                    url: 'https://ethereum.publicnode.com',
                    timeout: 120 * 1000
                },
                {
                    url: 'https://rpc.ankr.com/eth',
                    timeout: 120 * 1000
                },
            ]
        },
        streamRegistryChainRPCs: {
            name: 'polygon',
            chainId: 137,
            rpcs: [{
                url: 'https://polygon-rpc.com',
                timeout: 120 * 1000
            }, {
                url: 'https://poly-rpc.gateway.pokt.network/',
                timeout: 120 * 1000
            }]
        },
        ethereumNetworks: {
            polygon: {
                chainId: 137,
                highGasPriceStrategy: true
            }
        },
        theGraphUrl: 'https://api.thegraph.com/subgraphs/name/streamr-dev/streams',
        maxConcurrentCalls: 10
    },
    cache: {
        maxSize: 10000,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
}

// TODO add typing
export default function getClientConfig(mods: any = {}): any {
    const { client } = getConfig()

    return {
        ...DEFAULT_CLIENT_CONFIG,
        network: {
            ...DEFAULT_CLIENT_CONFIG.network,
            trackers: formatTrackers(client?.network?.trackers) || DEFAULT_CLIENT_CONFIG.network?.trackers,
        },
        contracts: {
            ...DEFAULT_CLIENT_CONFIG.contracts,
            mainChainRPCs: formatRpc(client?.mainchain?.rpc) || DEFAULT_CLIENT_CONFIG.contracts.mainChainRPCs,
            streamRegistryChainAddress: client?.streamRegistryChainAddress || DEFAULT_CLIENT_CONFIG.contracts.streamRegistryChainAddress,
            streamRegistryChainRPCs: formatRpc(client?.streamRegistryChain?.rpc) || DEFAULT_CLIENT_CONFIG.contracts.streamRegistryChainRPCs,
            streamStorageRegistryChainAddress:
                client?.streamStorageRegistryChainAddress || DEFAULT_CLIENT_CONFIG.contracts.streamStorageRegistryChainAddress,
            theGraphUrl: formatConfigUrl(client?.graphUrl) || DEFAULT_CLIENT_CONFIG.contracts.theGraphUrl,
        },
        metrics: false,
        ...mods,
    }
}
