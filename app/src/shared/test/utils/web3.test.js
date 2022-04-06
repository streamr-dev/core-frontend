import Web3 from 'web3'
import * as all from '$shared/utils/web3'
import * as getConfig from '$shared/web3/config'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import getChainId from '$utils/web3/getChainId'

jest.mock('$utils/web3/getPublicWeb3', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockPublicWeb3(publicWeb3) {
    return getPublicWeb3.mockImplementation(() => publicWeb3)
}

jest.mock('$utils/web3/getChainId', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockChainId(chainId) {
    return getChainId.mockImplementation(() => Promise.resolve(chainId))
}

describe('web3 utils', () => {
    const web3 = new Web3()

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    chainId: '1',
                },
            }))

            mockChainId('1')

            await all.checkEthereumNetworkIsCorrect({
                web3,
            })
        })

        it('must fail if required network is not the same as the actual network', async (done) => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    chainId: '2',
                },
            }))

            mockChainId('1')

            try {
                await all.checkEthereumNetworkIsCorrect({
                    web3,
                })
            } catch (e) {
                done()
            }
        })

        it('must resolve if required sidechain is the same as the actual network', async () => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    chainId: '1',
                },
                dataunionsChain: {
                    chainId: '8995',
                },
            }))

            mockChainId('8995')

            await all.checkEthereumNetworkIsCorrect({
                web3,
                network: 8995,
            })
        })

        it('must fail if required sidechain is not the same as the actual network', async (done) => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    chainId: '2',
                },
                dataunionsChain: {
                    chainId: '8995',
                },
            }))

            mockChainId('1')

            try {
                await all.checkEthereumNetworkIsCorrect({
                    web3,
                    network: 8995,
                })
            } catch (e) {
                done()
            }
        })
    })

    describe('hasTransactionCompleted', () => {
        it('returns true if transaction has a block number', async () => {
            const trx = {
                blockNumber: 12345,
            }
            const transactionStub = jest.fn(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }

            mockPublicWeb3(publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            expect(result).toBe(true)
        })

        it('returns false if transaction doesnt have a block number', async () => {
            const trx = {
                blockNumber: null,
            }
            const transactionStub = jest.fn(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }

            mockPublicWeb3(publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            expect(result).toBe(false)
        })

        it('returns false if transaction is null', async () => {
            const trx = null
            const transactionStub = jest.fn(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }

            mockPublicWeb3(publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            expect(result).toBe(false)
        })
    })
})
