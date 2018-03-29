import assert from 'assert-diff'
import sinon from 'sinon'

import web3Config from '../../../../web3/web3Config'
import * as all from '../../../../modules/token/services'
import * as utils from '../../../../utils/smartContract'
import * as getWeb3 from '../../../../web3/web3Provider'

describe('Token services', () => {
    let sandbox
    let config
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
        config = {
            ...web3Config
        }
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
                },
                options: {
                    address: 'marketplaceAddress'
                }
            }))
            await all.getAllowance()
            assert(allowanceStub.calledOnce)
            assert.equal('testAccount', allowanceStub.getCall(0).args[0])
            assert.equal('marketplaceAddress', allowanceStub.getCall(0).args[1])
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
                },
                options: {
                    address: 'marketplaceAddress'
                }
            }))
            const result = await all.getAllowance()
            assert.equal('moi', result)
        })
    })
})
