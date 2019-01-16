import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '$shared/utils/web3'
import * as getConfig from '$shared/web3/config'
import * as getWeb3 from '$shared/web3/web3Provider'

describe('web3 utils', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                networkId: '1',
            }))
            await all.checkEthereumNetworkIsCorrect({
                getEthereumNetwork: () => Promise.resolve(1),
            })
        })

        it('must fail if required network is not the same as the actual network', async (done) => {
            sandbox.stub(getConfig, 'default').callsFake(() => ({
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
            const transactionStub = sandbox.stub().callsFake(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }
            sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            assert.deepStrictEqual(true, result)
        })

        it('returns false if transaction doesnt have a block number', async () => {
            const trx = {
                blockNumber: null,
            }
            const transactionStub = sandbox.stub().callsFake(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }
            sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            assert.deepStrictEqual(false, result)
        })

        it('returns false if transaction is null', async () => {
            const trx = null
            const transactionStub = sandbox.stub().callsFake(() => Promise.resolve(trx))
            const publicWeb3Stub = {
                eth: {
                    getTransaction: transactionStub,
                },
            }
            sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => publicWeb3Stub)

            const result = await all.hasTransactionCompleted('0x123')
            assert.deepStrictEqual(false, result)
        })
    })
})
