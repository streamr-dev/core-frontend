import sinon from 'sinon'
import BN from 'bignumber.js'

import * as all from '$mp/utils/web3'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as getConfig from '$shared/web3/config'

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
        it('gets balance with web3 from metamask', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = sandbox.stub().callsFake(() => Promise.resolve(accountBalance))
            sandbox.stub(getWeb3, 'getWeb3').callsFake(() => ({
                eth: {
                    getBalance: balanceStub,
                },
            }))
            const balance = await all.getEthBalance('testAccount')
            expect(balanceStub.calledOnce).toBe(true)
            expect(balanceStub.calledWith('testAccount')).toBe(true)
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })

        it('gets balance from public web3', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = sandbox.stub().callsFake(() => Promise.resolve(accountBalance))
            sandbox.stub(getWeb3, 'getPublicWeb3').callsFake(() => ({
                eth: {
                    getBalance: balanceStub,
                },
            }))
            const balance = await all.getEthBalance('testAccount', true)
            expect(balanceStub.calledOnce).toBe(true)
            expect(balanceStub.calledWith('testAccount')).toBe(true)
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })

    describe('getDataTokenBalance', () => {
        it('gets balance with web3 from metamask', async () => {
            const accountBalance = BN('2209000000000000000000')
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                token: 'token',
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getDataTokenBalance('testAccount')
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub.calledOnce).toBe(true)
            expect(getContractStub.calledWith('token', false)).toBe(true)
            expect(balanceStub.calledOnce).toBe(true)
            expect(balanceStub.calledWith('testAccount')).toBe(true)
        })

        it('gets balance with public web3', async () => {
            const accountBalance = BN('2209000000000000000000')
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                token: 'token',
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getDataTokenBalance('testAccount', true)
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub.calledOnce).toBe(true)
            expect(getContractStub.calledWith('token', true)).toBe(true)
            expect(balanceStub.calledOnce).toBe(true)
            expect(balanceStub.calledWith('testAccount')).toBe(true)
        })
    })

    describe('getMyEthBalance', () => {
        it('gets ethereum balance', async () => {
            const accountBalance = BN(123450000000000000)
            sandbox.stub(getWeb3, 'getWeb3').callsFake(() => ({
                getDefaultAccount: sandbox.stub().callsFake(() => Promise.resolve('testAccount')),
                eth: {
                    getBalance: sandbox.stub().callsFake(() => Promise.resolve(accountBalance)),
                },
            }))

            const balance = await all.getMyEthBalance()
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })

    describe('getMyDataTokenBalance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'getWeb3').callsFake(() => ({
                getDefaultAccount: sandbox.stub().callsFake(() => Promise.resolve('testAccount')),
            }))

            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('100000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            await all.getMyDataTokenBalance()
            expect(getContractStub.calledOnce).toBe(true)
            expect(getContractStub.getCall(0).args[0].abi.find((f) => f.name === 'balanceOf')).toBeDefined()
            expect(balanceStub.calledOnce).toBe(true)
            expect(balanceStub.calledWith('testAccount')).toBe(true)
        })

        it('must transform the result from wei to tokens', async () => {
            const accountBalance = BN('2209000000000000000000')
            sandbox.stub(getWeb3, 'getWeb3').callsFake(() => ({
                getDefaultAccount: sandbox.stub().callsFake(() => Promise.resolve('testAccount')),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getMyDataTokenBalance()
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })
})
