import { STREAM_CLIENT_DEFAULTS } from 'streamr-client'
import getConfig from '$app/src/getters/getConfig'
import g from './getClientConfig'
// Filter out what's unexpected. FIXME: fix the client.
const { ...DEFAULTS } = STREAM_CLIENT_DEFAULTS
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
            ...DEFAULTS,
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
            ...DEFAULTS,
            network: {
                trackers: ['tracker1', 'tracker2'],
            },
            contracts: {
                ...DEFAULTS.contracts,
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
