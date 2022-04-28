import getPublicWeb3 from './getPublicWeb3'

jest.mock('$app/src/getters/getConfig', () => {
    const { default: gc } = jest.requireActual('$app/src/getters/getConfig')

    const actualConfig = gc()

    return {
        __esModule: true,
        default: () => ({
            ...actualConfig,
            client: {
                ...actualConfig.client,
                mainchain: {
                    ...actualConfig.client.mainchain,
                    rpc: {
                        ...actualConfig.client.mainchain.rpc,
                        rpcs: [{
                            url: 'http://mainchainrpc:8545',
                        }],
                    },
                },
            },
        }),
    }
})

describe('getPublicWeb3', () => {
    it('returns a web3 with the public provider', () => {
        expect(getPublicWeb3().currentProvider.host).toBe('http://mainchainrpc:8545')
    })
})
