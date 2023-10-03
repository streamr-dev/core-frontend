import * as all from '~/shared/utils/web3'
import getChainId from '~/utils/web3/getChainId'

jest.mock('~/shared/stores/wallet', () => ({
    __esModule: true,
    getPublicWeb3Provider: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

jest.mock('~/utils/web3/getChainId', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockChainId(chainId) {
    const getChainIdMock = getChainId as jest.Mock
    return getChainIdMock.mockImplementation(() => Promise.resolve(chainId))
}

describe('web3 utils', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            mockChainId('1')
            await all.checkEthereumNetworkIsCorrect({
                network: 1,
            })
        })
        it('must fail if required network is not the same as the actual network', async () => {
            mockChainId('1')

            await expect(
                all.checkEthereumNetworkIsCorrect({
                    network: 2,
                }),
            ).rejects.toThrow()
        })
        it('must resolve if required sidechain is the same as the actual network', async () => {
            mockChainId('8995')
            await all.checkEthereumNetworkIsCorrect({
                network: 8995,
            })
        })
        it('must fail if required sidechain is not the same as the actual network', async () => {
            mockChainId('1')

            await expect(
                all.checkEthereumNetworkIsCorrect({
                    network: 8995,
                }),
            ).rejects.toThrow()
        })
    })
})
