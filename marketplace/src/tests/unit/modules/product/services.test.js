import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '../../../../modules/product/services'
import * as utils from '../../../../utils/smartContract'
import * as getWeb3 from '../../../../web3/web3Provider'

describe('Product services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getProductById', () => {
        it('is not implemented yet', () => {
            assert(true, 'nope, still not implemented') // TODO Implementation!
        })
    })

    describe('getStreamsByProductId', () => {
        it('is not implemented yet', () => {
            assert(true, 'nope, still not implemented') // TODO Implementation!
        })
    })

    describe('getMyProductSubscription', () => {
        it('must work as intended', async () => {
            const accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve({
                    status: '0x1',
                    pricePerSecond: '0',
                }),
            }))
            const getSubscriptionStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve({
                    endTimestamp: '0',
                }),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    getProduct: getProductStub,
                    getSubscription: getSubscriptionStub,
                },
            }))
            const result = await all.getMyProductSubscription('1234abcdef')
            assert.deepStrictEqual({
                productId: '1234abcdef',
                endTimestamp: 0,
            }, result)
            assert(getProductStub.calledOnce)
            assert(getSubscriptionStub.calledOnce)
            assert(getContractStub.calledTwice)
            assert(getProductStub.calledWith('0x1234abcdef'))
            assert(getSubscriptionStub.calledWith('0x1234abcdef', 'testAccount'))
        })
        it('must throw error if no product found', async (done) => {
            const accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = sandbox.stub().callsFake(() => Promise.resolve({
                call: () => Promise.resolve({
                    owner: '0x000',
                }),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => Promise.resolve({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            try {
                await all.getProductFromContract('1234abcdef')
            } catch (e) {
                done()
            }
        })
    })
})
