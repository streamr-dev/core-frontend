import getConfig from '$app/src/getters/getConfig'
import g, {DEFAULT_CLIENT_CONFIG} from './getClientConfig'
// Filter out what's unexpected. FIXME: fix the client.
jest.mock('$app/src/getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))
describe('getClientConfig', () => {
    it("when empty, defaults to streamr-client's configuration", () => {
        (getConfig as any).mockImplementation(() => ({
            /* emptiness */
        }))
        const mods = {}

        expect(g()).toMatchObject({
            ...DEFAULT_CLIENT_CONFIG,
            ...mods,
            metrics: false,
        })
    })
    it('gets overwritten with config', () => {
        (getConfig as any).mockImplementation(() => ({
            client: {
                network: {
                    trackers: ['tracker1', 'tracker2'],
                },
                streamRegistryChainAddress: 'stream reg address',
                streamRegistryChain: {
                    rpc: 'stream reg rpc',
                },
                streamStorageRegistryChainAddress: 'stream storage reg address',
                graphUrl: 'graph url',
                mainchain: {
                    rpc: 'mc chain rpc',
                },
            },
        }))
        expect(g()).toMatchObject({
            ...DEFAULT_CLIENT_CONFIG,
            network: {
                trackers: ['tracker1', 'tracker2'],
            },
            contracts: {
                ...DEFAULT_CLIENT_CONFIG.contracts,
                mainChainRPCs: 'mc chain rpc',
                streamRegistryChainAddress: 'stream reg address',
                streamRegistryChainRPCs: 'stream reg rpc',
                streamStorageRegistryChainAddress: 'stream storage reg address',
                theGraphUrl: 'graph url',
            },
            metrics: false,
        })
    })
})
