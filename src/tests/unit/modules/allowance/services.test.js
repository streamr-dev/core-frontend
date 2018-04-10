import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '../../../../modules/allowance/services'
import * as utils from '../../../../utils/smartContract'
import * as getWeb3 from '../../../../web3/web3Provider'

describe('Token services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })

    describe('getMyAllowance', () => {
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
            await all.getMyAllowance()
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
            const result = await all.getMyAllowance()
            assert.equal(276, result)
        })
    })

    describe('getMyTokenBalance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('100000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            await all.getMyTokenBalance()
            assert(getContractStub.calledOnce)
            assert(getContractStub.getCall(0).args[0].abi.find((f) => f.name === 'balanceOf'))
            assert(balanceStub.calledOnce)
            assert(balanceStub.calledWith('testAccount'))
        })
        it('must transform the result from wei to tokens', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('2209000000000000000000').toString()),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getMyTokenBalance()
            assert.equal(2209, result)
        })
    })

    describe('getDataPerUsd', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('10000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    dataPerUsd: balanceStub,
                },
            }))
            await all.getDataPerUsd()
            assert(getContractStub.calledOnce)
            assert(getContractStub.getCall(0).args[0].abi.find((f) => f.name === 'dataPerUsd'))
            assert(balanceStub.calledOnce)
        })
        it('must transform the result from wei to tokens', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const dataPerUsdStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('209000000000000000000').toString()),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    dataPerUsd: dataPerUsdStub,
                },
            }))
            const result = await all.getDataPerUsd()
            assert.equal(209, result)
        })
    })

    describe('setMyAllowance', () => {
        it('must call the correct method', async () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
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
            all.setMyAllowance(100)
            assert(approveStub.calledOnce)
            assert(approveStub.calledWith('marketplaceAddress', '100000000000000000000'))
        })
        it('must not approve negative values', (done) => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub,
                },
            }))
            try {
                all.setMyAllowance(-100)
            } catch (e) {
                assert(e.message.match(/non-negative/))
                done()
            }
        })
        it('must return the result of send', () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
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
            const result = all.setMyAllowance(100)
            assert.equal('test', result)
        })
    })
})
