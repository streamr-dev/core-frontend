import BN from 'bignumber.js'

import * as all from '$mp/utils/web3'
import * as utils from '$mp/utils/smartContract'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import getChainId from '$utils/web3/getChainId'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import getWeb3 from '$utils/web3/getWeb3'

jest.mock('$utils/web3/getPublicWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('$utils/web3/getDefaultWeb3Account', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('$utils/web3/getWeb3', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('$utils/web3/getChainId', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockChainId(chainId) {
    return getChainId.mockImplementation(() => Promise.resolve(chainId))
}

function mockDefaultAccount(defaultAccount) {
    return getDefaultWeb3Account.mockImplementation(() => Promise.resolve(defaultAccount))
}
import { getDataTokenAbiAndAddress } from '$mp/utils/web3'

describe('web3 utils', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        getPublicWeb3.mockReset()
        getDefaultWeb3Account.mockReset()
        getWeb3.mockReset()
    })

    describe('getEthBalance', () => {
        it('gets balance with web3 from metamask', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = jest.fn(() => Promise.resolve(accountBalance))
            getWeb3.mockImplementation(() => ({
                eth: {
                    getBalance: balanceStub,
                },
                getChainId: jest.fn(() => Promise.resolve(8995)),
            }))
            const balance = await all.getEthBalance('testAccount')
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })

        it('gets balance from public web3', async () => {
            const accountBalance = BN(123450000000000000)
            const balanceStub = jest.fn(() => Promise.resolve(accountBalance))

            getPublicWeb3.mockImplementationOnce(() => ({
                eth: {
                    getBalance: balanceStub,
                },
                getChainId: jest.fn(() => Promise.resolve(8995)),
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
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getDataTokenBalance('testAccount', false, 8995)
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toBeCalledWith(getDataTokenAbiAndAddress(8995), false, 8995)
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })

        it('gets balance with public web3', async () => {
            const accountBalance = BN('2209000000000000000000')
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getDataTokenBalance('testAccount', true, 8995)
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toBeCalledWith(getDataTokenAbiAndAddress(8995), true, 8995)
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })
    })

    describe('getMyEthBalance', () => {
        it('gets ethereum balance', async () => {
            const accountBalance = BN(123450000000000000)

            mockDefaultAccount('testAccount')

            getWeb3.mockImplementation(() => ({
                eth: {
                    getBalance: jest.fn(() => Promise.resolve(accountBalance)),
                },
                getChainId: jest.fn(() => Promise.resolve(8995)),
            }))

            const balance = await all.getMyEthBalance()
            expect(balance.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })

    describe('getMyDataTokenBalance', () => {
        it('must call the correct method', async () => {
            mockDefaultAccount('testAccount')
            mockChainId(8995)

            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve('100000'),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            await all.getMyDataTokenBalance(8995)
            expect(getContractStub).toHaveBeenCalledTimes(1)
            expect(getContractStub.mock.calls[0][0].abi.find((f) => f.name === 'balanceOf')).toBeDefined()
            expect(balanceStub).toHaveBeenCalledTimes(1)
            expect(balanceStub).toBeCalledWith('testAccount')
        })

        it('must transform the result from wei to tokens', async () => {
            mockDefaultAccount('testAccount')
            mockChainId(8995)

            const accountBalance = BN('2209000000000000000000')
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve(accountBalance),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    balanceOf: balanceStub,
                },
            }))
            const result = await all.getMyDataTokenBalance(8995)
            expect(result.isEqualTo(accountBalance.dividedBy(1e18))).toBe(true)
        })
    })
})
