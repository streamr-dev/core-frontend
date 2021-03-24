import * as all from '$shared/utils/web3'
import * as getConfig from '$shared/web3/config'
import * as getWeb3 from '$shared/web3/web3Provider'

describe('web3 utils', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                networkId: '1',
            }))
            await all.checkEthereumNetworkIsCorrect({
                getEthereumNetwork: () => Promise.resolve(1),
            })
        })

        it('must fail if required network is not the same as the actual network', async (done) => {
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                networkId: '2',
            }))
            try {
                await all.checkEthereumNetworkIsCorrect({
                    getEthereumNetwork: () => Promise.resolve(1),
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
            jest.spyOn(getWeb3, 'getPublicWeb3').mockImplementation(() => publicWeb3Stub)

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
            jest.spyOn(getWeb3, 'getPublicWeb3').mockImplementation(() => publicWeb3Stub)

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
            jest.spyOn(getWeb3, 'getPublicWeb3').mockImplementation(() => publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            expect(result).toBe(false)
        })
    })
})
