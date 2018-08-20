import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '../../../src/utils/web3'
import * as utils from '../../../src/utils/smartContract'
import * as getWeb3 from '../../../src/web3/web3Provider'

describe('web3 utils', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
    })

    describe('getEthBalance', () => {
        it('gets ethereum balance', async () => {
            const web3 = getWeb3.getWeb3()
            sandbox.stub(web3.eth, 'getAccounts').callsFake(() => Promise.resolve(['0xTEST']))
            sandbox.stub(web3.eth, 'getBalance').callsFake(() => Promise.resolve(123450000000000000))

            const balance = await all.getEthBalance()
            assert.equal(balance, 0.12345)
        })
    })

    describe('getDataTokenBalance', () => {
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
            await all.getDataTokenBalance()
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
            const result = await all.getDataTokenBalance()
            assert.equal(2209, result)
        })
    })
})
