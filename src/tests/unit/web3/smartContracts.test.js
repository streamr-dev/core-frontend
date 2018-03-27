import assert from 'assert-diff'
import sinon from 'sinon'
import EventEmitter from 'events'

import * as all from '../../../web3/smartContracts'
import * as utils from '../../../utils/smartContract'

describe('smartContract wrappers', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('marketplace', () => {
        describe('getProduct', () => {
            it('must transform the id to hex', async () => {
                const getProductStub = sandbox.stub().callsFake(() => ({
                    call: () => Promise.resolve('moi')
                }))
                const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                    methods: {
                        getProduct: getProductStub
                    }
                }))
                const result = await all.marketplaceContract.getProduct('aapeli')
                assert.equal('moi', result)
                assert(getContractStub.calledOnce)
                assert(getProductStub.calledOnce)
                assert(getProductStub.calledWith('0x616170656c69'))
            })
            it('must throw error if owner is 0', async (done) => {
                const getProductStub = sandbox.stub().callsFake(() => Promise.resolve({
                    call: () => Promise.resolve({
                        owner: '0x000'
                    })
                }))
                sandbox.stub(utils, 'getContract').callsFake(() => Promise.resolve({
                    methods: {
                        getProduct: getProductStub
                    }
                }))
                try {
                    await all.marketplaceContract.getProduct('aapeli')
                } catch (e) {
                    done()
                }
            })
        })
        describe('buy', () => {
            it('must transform the id to hex', async () => {
                const buyStub = sinon.stub().callsFake(() => ({
                    send: () => 'test'
                }))
                sandbox.stub(utils, 'send').callsFake((method) => method.send())
                sandbox.stub(utils, 'getContract').callsFake(() => ({
                    methods: {
                        buy: buyStub
                    }
                }))
                await all.marketplaceContract.buy('aapeli', 1000)
                assert(buyStub.calledOnce)
                assert(buyStub.calledWith('0x616170656c69', 1000))
            })
            it('must call send with correct object', (done) => {
                sandbox.stub(utils, 'send').callsFake((a) => {
                    assert.equal('test', a)
                    done()
                })
                sandbox.stub(utils, 'getContract').callsFake(() => ({
                    methods: {
                        buy: () => 'test'
                    }
                }))
                all.marketplaceContract.buy('aapeli', 1000)
            })
            it('must return the result of send', () => {
                sandbox.stub(utils, 'send').callsFake(() => 'test')
                sandbox.stub(utils, 'getContract').callsFake(() => ({
                    methods: {
                        buy: () => {}
                    }
                }))
                assert.equal('test', all.marketplaceContract.buy('aapeli', 1000))
            })
        })
    })
})
