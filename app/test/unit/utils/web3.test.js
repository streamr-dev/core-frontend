import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '$mp/utils/web3'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'

describe('web3 utils', () => {
    let sandbox
    let web3

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        web3 = new getWeb3.StreamrWeb3()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
        web3 = null
    })

    describe('getEthBalance', () => {
        it('gets ethereum balance', async () => {
            sandbox.stub(web3, 'eth').value({
                getAccounts: sandbox.stub().callsFake(() => Promise.resolve(['0xTEST'])),
                getBalance: sandbox.stub().callsFake(() => Promise.resolve(123450000000000000)),
            })

            const balance = await all.getEthBalance(web3)
            assert.deepStrictEqual(balance.toString(), '0.12345')
        })
    })

    describe('getDataTokenBalance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(web3, 'getDefaultAccount').callsFake(() => Promise.resolve('testAccount'))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('100000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            await all.getDataTokenBalance(web3)
            assert(getContractStub.calledOnce)
            assert(getContractStub.getCall(0).args[0].abi.find((f) => f.name === 'balanceOf'))
            assert(balanceStub.calledOnce)
            assert(balanceStub.calledWith('testAccount'))
        })

        it('must transform the result from wei to tokens', async () => {
            sandbox.stub(web3, 'getDefaultAccount').callsFake(() => Promise.resolve('testAccount'))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('2209000000000000000000').toString()),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getDataTokenBalance(web3)
            assert.deepStrictEqual('2209', result.toString())
        })
    })
})
