import { RPCProtocol } from '@streamr/config'
import getConfig from './getConfig'
import { defaultChainConfig } from './getChainConfig'
import g from './getClientConfig'
// Filter out what's unexpected. FIXME: fix the client.
jest.mock('~//getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))
describe('getClientConfig', () => {
    it("when empty, defaults to streamr-client's configuration", () => {
        ;(getConfig as any).mockImplementation(() => ({
            /* emptiness */
        }))
        const mods = {}

        expect(g()).toMatchObject({
            ...mods,
            metrics: false,
        })
    })
    it('gets overwritten with config', () => {
        ;(getConfig as any).mockImplementation(() => ({
            client: {
                network: {
                    trackers: ['tracker1', 'tracker2'],
                },
                graphUrl: 'graph url',
            },
        }))
        expect(g()).toMatchObject({
            network: {
                trackers: ['tracker1', 'tracker2'],
            },
            contracts: expect.objectContaining({
                mainChainRPCs: {
                    chainId: defaultChainConfig.id,
                    rpcs: defaultChainConfig.getRPCEndpointsByProtocol(RPCProtocol.HTTP),
                },
                streamRegistryChainAddress: defaultChainConfig.contracts.StreamRegistry,
                streamRegistryChainRPCs: {
                    chainId: defaultChainConfig.id,
                    rpcs: defaultChainConfig.getRPCEndpointsByProtocol(RPCProtocol.HTTP),
                },
                streamStorageRegistryChainAddress:
                    defaultChainConfig.contracts.StreamStorageRegistry,
                theGraphUrl: 'graph url',
            }),
            metrics: false,
        })
    })
})
