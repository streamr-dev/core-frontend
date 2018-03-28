import assert from 'assert-diff'
import sinon from 'sinon'

import config from '../../../../web3/web3Config'
import * as all from '../../../../modules/token/services'
import * as utils from '../../../../utils/smartContract'
import * as getWeb3 from '../../../../web3/web3Provider'

describe('Token services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getAllowance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount')
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi')
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    allowance: allowanceStub
                }
            }))
            await all.getAllowance()
            assert(allowanceStub.calledOnce)
            assert.equal('testAccount', allowanceStub.getCall(0).args[0])
            assert.equal(config.smartContracts.marketplace.address, allowanceStub.getCall(0).args[1])
        })
        it('must return the result of send', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount')
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi')
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    allowance: allowanceStub
                }
            }))
            const result = await all.getAllowance()
            assert.equal('moi', result)
        })
    })

    describe('setAllowance', () => {
        it('must call the correct method', async () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test'
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub
                }
            }))
            all.setAllowance(100)
            assert(approveStub.calledOnce)
            assert(approveStub.calledWith(config.smartContracts.marketplace.address, 100))
        })
        it('must not approve negative values', () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test'
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub
                }
            }))
            try {
                all.setAllowance(-100)
            } catch (e) {
                assert(e.message.match(/non-negative/))
            }
        })
        it('must return the result of send', () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test'
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub
                }
            }))
            const result = all.setAllowance(100)
            assert.equal('test', result)
        })
    })
})
