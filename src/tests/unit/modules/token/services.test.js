import assert from 'assert-diff'
import sinon from 'sinon'

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

    describe('getMyAllowance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi'),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    allowance: allowanceStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            await all.getMyAllowance()
            assert(allowanceStub.calledOnce)
            assert.equal('testAccount', allowanceStub.getCall(0).args[0])
            assert.equal('marketplaceAddress', allowanceStub.getCall(0).args[1])
        })
        it('must return the result of call', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi'),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    allowance: allowanceStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            const result = await all.getMyAllowance()
            assert.equal('moi', result)
        })
    })

    describe('getMyTokenBalance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi'),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            await all.getMyTokenBalance()
            assert(balanceStub.calledOnce)
            assert(balanceStub.calledWith('testAccount'))
        })
        it('must return the result of call', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('moi'),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getMyTokenBalance()
            assert.equal('moi', result)
        })
    })
})
