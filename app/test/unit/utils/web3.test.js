import BN from 'bignumber.js'

import * as all from '$mp/utils/web3'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as getConfig from '$shared/web3/config'

describe('web3 utils', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getEthBalance', () => {
        it('gets balance with web3 from metamask', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = jest.fn(() => Promise.resolve(accountBalance))
            jest.spyOn(getWeb3, 'getWeb3').mockImplementation(() => ({
                eth: {
                    getBalance: balanceStub,
                },
            }))
            const balance = await all.getEthBalance('testAccount')
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })

        it('gets balance from public web3', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = jest.fn(() => Promise.resolve(accountBalance))
            jest.spyOn(getWeb3, 'getPublicWeb3').mockImplementation(() => ({
                eth: {
                    getBalance: balanceStub,
                },
            }))
            const balance = await all.getEthBalance('testAccount', true)
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })

    describe('getDataTokenBalance', () => {
        it('gets balance with web3 from metamask', async () => {
            const accountBalance = BN('2209000000000000000000')
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    dataToken: 'dataToken',
                },
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getDataTokenBalance('testAccount')
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toBeCalledWith('dataToken', false)
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })

        it('gets balance with public web3', async () => {
            const accountBalance = BN('2209000000000000000000')
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    dataToken: 'dataToken',
                },
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getDataTokenBalance('testAccount', true)
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toBeCalledWith('dataToken', true)
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })
    })

    describe('getMyEthBalance', () => {
        it('gets ethereum balance', async () => {
            const accountBalance = BN(123450000000000000)
            jest.spyOn(getWeb3, 'getWeb3').mockImplementation(() => ({
                getDefaultAccount: jest.fn(() => Promise.resolve('testAccount')),
                eth: {
                    getBalance: jest.fn(() => Promise.resolve(accountBalance)),
                },
            }))

            const balance = await all.getMyEthBalance()
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })

    describe('getMyDataTokenBalance', () => {
        it('must call the correct method', async () => {
            jest.spyOn(getWeb3, 'getWeb3').mockImplementation(() => ({
                getDefaultAccount: jest.fn(() => Promise.resolve('testAccount')),
            }))

            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve('100000'),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            await all.getMyDataTokenBalance()
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub.mock.calls[0][0].abi.find((f) => f.name === 'balanceOf')).toBeDefined()
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })

        it('must transform the result from wei to tokens', async () => {
            const accountBalance = BN('2209000000000000000000')
            jest.spyOn(getWeb3, 'getWeb3').mockImplementation(() => ({
                getDefaultAccount: jest.fn(() => Promise.resolve('testAccount')),
            }))
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getMyDataTokenBalance()
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })
})
