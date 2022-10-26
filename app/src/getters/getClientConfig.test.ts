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
    it("when empty, defaults to streamr-client's configuration", () => {
        (getConfig as any).mockImplementation(() => ({
            /* emptiness */
        }))
        const mods = {}
        console.log(DEFAULTS)

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
            mainChainRPCs: 'mc chain rpc',
            network: {
                trackers: ['tracker1', 'tracker2'],
            },
            streamRegistryChainAddress: 'stream reg address',
            streamRegistryChainRPCs: 'stream reg rpc',
            streamStorageRegistryChainAddress: 'stream storage reg address',
            theGraphUrl: 'graph url',
            metrics: false,
        })
    })
})
