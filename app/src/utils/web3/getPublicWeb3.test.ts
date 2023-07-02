import getPublicWeb3 from './getPublicWeb3'
jest.mock('$app/src/getters/getConfig', () => {
    const { default: gc } = jest.requireActual('$app/src/getters/getConfig')
    const actualConfig = gc()
    return {
        __esModule: true,
        default: () => ({
            ...actualConfig,
            core: {
                mainnetInfuraUrl: 'http://mainchainrpc:8545',
            },
        }),
    }
})
describe('getPublicWeb3', () => {
    it('returns a web3 with the public provider', () => {
        expect((getPublicWeb3().currentProvider as any).host).toBe(
            'http://mainchainrpc:8545',
        )
    })
})
