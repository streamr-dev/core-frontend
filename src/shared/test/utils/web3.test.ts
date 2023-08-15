import * as all from '~/shared/utils/web3'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import getChainId from '~/utils/web3/getChainId'

jest.mock('~/shared/stores/wallet', () => ({
    __esModule: true,
    getPublicWeb3Provider: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockPublicWeb3(publicWeb3) {
    const getPublicWeb3ProviderMock = getPublicWeb3Provider as jest.Mock
    return getPublicWeb3ProviderMock.mockImplementation(() => publicWeb3)
}

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
