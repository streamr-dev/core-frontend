import assert from 'assert-diff'
import sinon from 'sinon'
import EventEmitter from 'events'

import * as all from '../../web3/smartContracts'
import * as utils from '../../utils/smartContract'

describe('smartContract wrappers', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('marketplace', () => {
        beforeEach(() => {

        })
        describe('getProduct', () => {
            it('must transform the id to hex', async () => {
                const getProductStub = sandbox.stub().callsFake(() => () => Promise.resolve({
                    call: () => Promise.resolve('moi')
                }))
                sandbox.stub(utils, 'getContract').callsFake(() => Promise.resolve({
                    methods: {
                        getProduct: getProductStub
                    }
                }))
                const result = await all.marketplaceContract.getProduct('aapeli')
                assert.equal('moi', result)
                assert(getProductStub.calledOnce)
                assert(getProductStub.calledWith('0x616170656c69'))
            })
            it('must throw error if owner is 0', async (done) => {
                const getProductStub = sandbox.stub().callsFake(() => () => Promise.resolve({
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
    })
})