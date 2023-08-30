import setTempEnv from '../../test/test-utils/setTempEnv'
import getConfig from './getConfig'
import { defaultChainConfig } from './getChainConfig'
import g from './getClientConfig'
// Filter out what's unexpected. FIXME: fix the client.
jest.mock('~//getters/getConfig', () => ({
    __esModule: true,
    default: jest.fn(),
}))

setTempEnv({ STREAMR_DOCKER_DEV_HOST: null })

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
                graphUrl: 'graph url',
            },
        }))
        expect(g()).toMatchObject({
            contracts: expect.objectContaining({
                mainChainRPCs: {
                    chainId: defaultChainConfig.id,
                    rpcs: defaultChainConfig.rpcEndpoints,
                },
                streamRegistryChainAddress: defaultChainConfig.contracts.StreamRegistry,
                streamRegistryChainRPCs: {
                    chainId: defaultChainConfig.id,
                    rpcs: defaultChainConfig.rpcEndpoints,
                },
                streamStorageRegistryChainAddress:
                    defaultChainConfig.contracts.StreamStorageRegistry,
                theGraphUrl: 'graph url',
            }),
            metrics: false,
        })
    })
})
