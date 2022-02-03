import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import getConfig from '$app/src/getters/getConfig'
import g from './getClientConfig'

// Filter out what's unexpected. FIXME: fix the client.
const { ensCacheChainAddress, ...DEFAULTS } = STREAM_CLIENT_DEFAULTS

jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

xit('is ensCacheChainAddress in STREAM_CLIENT_DEFAULTS?', () => {
    // `ensCacheChainAddress` should not be part of the config. It's going away soon. Let's keep
    // this xitted example here as a clean-up reminder.
})

describe('getClientConfig', () => {
    it('when empty, defaults to streamr-client\'s configuration', () => {
        getConfig.mockImplementation(() => ({ /* emptiness */ }))

        const mods = {
            autoDisconnect: false,
            verifySignatures: 'never',
        }

        expect(g()).toMatchObject({
            ...DEFAULTS,
            ...mods,
        })
    })

    it('gets overwritten with config', () => {
        getConfig.mockImplementation(() => ({
            client: {
                dataUnion: {
                    factoryMainnetAddress: 'mainnet factory address',
                    templateMainnetAddress: 'mainnet template address',
                    factorySidechainAddress: 'side chain factory address',
                    templateSidechainAddress: 'side chain template address',
                },
                dataUnionChain: {
                    rpc: 'du chain rpc',
                },
                network: {
                    trackers: ['tracker1', 'tracker2'],
                },
                restUrl: 'rest url',
                streamRegistryContractAddress: 'stream reg address',
                streamRegistryChain: {
                    rpc: 'stream reg rpc',
                },
                streamrNodeAddress: 'streamr node address',
                streamStorageRegistryContractAddress: 'stream storage reg address',
                storageNodeRegistryContractAddress: 'storage node reg address',
                graphUrl: 'graph url',
                mainchain: {
                    dataTokenAddress: 'mc token address',
                    rpc: 'mc chain rpc',
                },
                sidechain: {
                    dataTokenAddress: 'sc token address',
                },
            },
        }))

        expect(g()).toMatchObject({
            ...DEFAULTS,
            autoConnect: true,
            autoDisconnect: false,
            dataUnion: {
                factoryMainnetAddress: 'mainnet factory address',
                templateMainnetAddress: 'mainnet template address',
                factorySidechainAddress: 'side chain factory address',
                templateSidechainAddress: 'side chain template address',
            },
            dataUnionChainRPC: 'du chain rpc',
            mainChainRPC: 'mc chain rpc',
            network: {
                trackers: ['tracker1', 'tracker2'],
            },
            nodeRegistryChainAddress: 'storage node reg address',
            restUrl: 'rest url',
            streamRegistryChainAddress: 'stream reg address',
            streamRegistryChainRPC: 'stream reg rpc',
            streamrNodeAddress: 'streamr node address',
            streamStorageRegistryChainAddress: 'stream storage reg address',
            theGraphUrl: 'graph url',
            tokenAddress: 'mc token address',
            tokenSidechainAddress: 'sc token address',
            verifySignatures: 'never',
        })
    })
})
