import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '$mp/modules/allowance/services'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'

describe('Token services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })

    describe('getMyDataAllowance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('1000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
                if (abi.find((f) => f.name === 'allowance')) {
                    return {
                        methods: {
                            allowance: allowanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            await all.getMyDataAllowance()
            assert(allowanceStub.calledOnce)
            assert(getContractStub.calledTwice)
            assert.equal('testAccount', allowanceStub.getCall(0).args[0])
            assert.equal('marketplaceAddress', allowanceStub.getCall(0).args[1])
        })
        it('must transform the result from wei to tokens', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('276000000000000000000').toString()),
            }))
            sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
                if (abi.find((f) => f.name === 'allowance')) {
                    return {
                        methods: {
                            allowance: allowanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            const result = await all.getMyDataAllowance()
            assert.equal(276, result)
        })
    })

    describe('setMyDataAllowance', () => {
        it('must call the correct method', async () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            await all.setMyDataAllowance(100)
            assert(approveStub.calledOnce)
            assert(approveStub.calledWith('marketplaceAddress', '100000000000000000000'))
        })
        it('must not approve negative values', (done) => {
            try {
                all.setMyDataAllowance(-100)
            } catch (e) {
                assert.equal('negativeAmount', e.message)
                done()
            }
        })
        it('must return the result of send', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('100000000000000000000'), // 100
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
                if (abi.find((f) => f.name === 'approve')) {
                    return {
                        methods: {
                            approve: approveStub,
                            balanceOf: balanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            const result = await all.setMyDataAllowance(100)
            assert.equal(result, 'test')
        })
    })
})
