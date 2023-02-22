import EventEmitter from 'events'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import BN from 'bignumber.js'
import Transaction from '$shared/utils/Transaction'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import * as priceUtils from '$mp/utils/price'
import * as web3Utils from '$mp/utils/web3'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as productActions from '$mp/modules/product/actions'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { fromDecimals } from '$mp/utils/math'
import usePurchase, { actionsTypes } from '../usePurchase'

jest.mock('$utils/web3/getDefaultWeb3Account', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockDefaultAccount(defaultAccount) {
    return (getDefaultWeb3Account as any).mockImplementation(() => Promise.resolve(defaultAccount))
}

const mockState = {}
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation((selectorFn) => selectorFn(mockState)),
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))

jest.mock('$mp/utils/web3', () => {
    const actual = jest.requireActual('$mp/utils/web3')

    return {
        ...actual,
        getCustomTokenDecimals: jest.fn().mockImplementation(() => 18),
        // This is really weird but it's needed to make it mockable per test
        validateBalanceForPurchase: jest.fn().mockImplementation(actual.validateBalanceForPurchase),
    }
})

/**
 * Update needed -outdated product models in the test cases, there is no mocking of contract-based services
 * Disabled the tests for now
 */
describe.skip('usePurchase', () => {
    let consoleMock = null
    beforeAll(() => {
        // don't show error as console.error
        consoleMock = jest.spyOn(console, 'error')
        consoleMock.mockImplementation((...args) => console.warn(...args))
    })
    beforeEach(() => {
        mockDefaultAccount('0x0000000000000000000000000000000000000000')
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks();
        (getDefaultWeb3Account as any).mockReset()
    })
    afterAll(() => {
        consoleMock.mockRestore()
    })
    describe('input errors', () => {
        it('throws an error if contract product not found', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            await act(async () => {
                try {
                    await purchase()
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no product')
                }
            })
        })
        it('throws an error if access period is not defined', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                pricingTokenAddress: '0x1337',
            }
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })
        })
        it('throws an error if pricing token is not defined', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no pricingTokenAddress')
                }
            })
        })
        it('throws an error if pricingTokenAddress is not DATA and trying to pay with DATA', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                minimumSubscriptionInSeconds: '0',
                pricingTokenAddress: '0x1337',
                chainId: 1,
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
            }
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                        accessPeriod,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('cannot pay for this product with DATA')
                }
            })
        })
        it('throws an error if pricingTokenAddress is not DATA and trying to pay with ETH', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                minimumSubscriptionInSeconds: '0',
                pricingTokenAddress: '0x1337',
                chainId: 1,
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.ETH,
            }
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                        accessPeriod,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('cannot pay for this product with ETH')
                }
            })
        })
        it('throws an error if currency is ETH or DAI and price not defined', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                minimumSubscriptionInSeconds: '0',
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
                // DATA
                chainId: 1,
            }
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 1,
                            timeUnit: 'hour',
                            paymentCurrency: paymentCurrencies.ETH,
                        },
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no price')
                }
            })
            await act(async () => {
                try {
                    await purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 1,
                            timeUnit: 'hour',
                            paymentCurrency: paymentCurrencies.DAI,
                        },
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no price')
                }
            })
        })
        it('throws an error if no balance available', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
                // DATA
                chainId: 1,
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.PRODUCT_DEFINED,
                price: '1234',
            }

            const web3UtilsMock = web3Utils as any
            web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => {
                throw new Error('no balance')
            })

            await act(async () => {
                await expect(purchase({
                    contractProduct,
                    accessPeriod,
                }))
                    .rejects
                    .toThrow('no balance')
            })
        })
    })
    describe('DATA Purchase actions', () => {
        it('purchases the product, resets existing allowance & sets allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const purchasePrice = priceUtils.priceForTimeUnits(
                contractProduct.pricePerSecond,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.RESET_DATA_ALLOWANCE,
                actionsTypes.SET_DATA_ALLOWANCE,
                actionsTypes.SUBSCRIPTION,
            ])
            const emitter1 = new EventEmitter()
            const tx1 = new Transaction(emitter1)
            const hash1 = 'test1'
            const receipt1 = {
                transactionHash: hash1,
            }
            const emitter2 = new EventEmitter()
            const tx2 = new Transaction(emitter2)
            const hash2 = 'test2'
            const receipt2 = {
                transactionHash: hash2,
            }
            const emitter3 = new EventEmitter()
            const tx3 = new Transaction(emitter3)
            const hash3 = 'test3'
            const receipt3 = {
                transactionHash: hash3,
            }
            const addTransactionStub = jest.spyOn(transactionActions, 'addTransaction')
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter1.emit('transactionHash', hash1)
                }, 200)
                setTimeout(() => {
                    emitter1.emit('receipt', receipt1)
                }, 400)
                setTimeout(() => {
                    emitter2.emit('transactionHash', hash2)
                }, 600)
                setTimeout(() => {
                    emitter2.emit('receipt', receipt2)
                }, 800)
                setTimeout(() => {
                    emitter3.emit('transactionHash', hash3)
                }, 1000)
                setTimeout(() => {
                    emitter3.emit('receipt', receipt3)
                    resolve(null)
                }, 1200)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(addTransactionStub).toHaveBeenCalledWith(hash1, transactionTypes.RESET_DATA_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash2, transactionTypes.SET_DATA_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash3, transactionTypes.SUBSCRIPTION)
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals(purchasePrice, '18'),
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: true,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
        it('purchases the product & sets allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const purchasePrice = priceUtils.priceForTimeUnits(
                contractProduct.pricePerSecond,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.SET_DATA_ALLOWANCE,
                actionsTypes.SUBSCRIPTION,
            ])
            const emitter1 = new EventEmitter()
            const tx1 = new Transaction(emitter1)
            const hash1 = 'test1'
            const receipt1 = {
                transactionHash: hash1,
            }
            const emitter2 = new EventEmitter()
            const tx2 = new Transaction(emitter2)
            const hash2 = 'test2'
            const receipt2 = {
                transactionHash: hash2,
            }

            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter1.emit('transactionHash', hash1)
                }, 200)
                setTimeout(() => {
                    emitter1.emit('receipt', receipt1)
                }, 400)
                setTimeout(() => {
                    emitter2.emit('transactionHash', hash2)
                }, 600)
                setTimeout(() => {
                    emitter2.emit('receipt', receipt2)
                    resolve(null)
                }, 800)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals(purchasePrice, '18'),
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: false,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
        it('purchases the product when there is enough allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const purchasePrice = priceUtils.priceForTimeUnits(
                contractProduct.pricePerSecond,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([actionsTypes.SUBSCRIPTION])
            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve(null)
                }, 400)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals(purchasePrice, '18'),
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: false,
                includeGasForResetAllowance: false,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
    })
    // TODO fix
    describe('DAI Purchase actions', () => {
        it('purchases the product, resets existing allowance & sets allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.RESET_DAI_ALLOWANCE,
                actionsTypes.SET_DAI_ALLOWANCE,
                actionsTypes.SUBSCRIPTION,
            ])
            const emitter1 = new EventEmitter()
            const tx1 = new Transaction(emitter1)
            const hash1 = 'test1'
            const receipt1 = {
                transactionHash: hash1,
            }
            const emitter2 = new EventEmitter()
            const tx2 = new Transaction(emitter2)
            const hash2 = 'test2'
            const receipt2 = {
                transactionHash: hash2,
            }
            const emitter3 = new EventEmitter()
            const tx3 = new Transaction(emitter3)
            const hash3 = 'test3'
            const receipt3 = {
                transactionHash: hash3,
            }

            const addTransactionStub = jest.spyOn(transactionActions, 'addTransaction')
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter1.emit('transactionHash', hash1)
                }, 200)
                setTimeout(() => {
                    emitter1.emit('receipt', receipt1)
                }, 400)
                setTimeout(() => {
                    emitter2.emit('transactionHash', hash2)
                }, 600)
                setTimeout(() => {
                    emitter2.emit('receipt', receipt2)
                }, 800)
                setTimeout(() => {
                    emitter3.emit('transactionHash', hash3)
                }, 1000)
                setTimeout(() => {
                    emitter3.emit('receipt', receipt3)
                    resolve(null)
                }, 1200)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.RESET_DAI_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.RESET_DAI_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.RESET_DAI_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(addTransactionStub).toHaveBeenCalledWith(hash1, transactionTypes.RESET_DAI_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash2, transactionTypes.SET_DAI_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash3, transactionTypes.SUBSCRIPTION)
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals('1234', '18'),
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: true,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
        it('purchases the product & sets allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.SET_DAI_ALLOWANCE,
                actionsTypes.SUBSCRIPTION,
            ])
            const emitter1 = new EventEmitter()
            const tx1 = new Transaction(emitter1)
            const hash1 = 'test1'
            const receipt1 = {
                transactionHash: hash1,
            }
            const emitter2 = new EventEmitter()
            const tx2 = new Transaction(emitter2)
            const hash2 = 'test2'
            const receipt2 = {
                transactionHash: hash2,
            }

            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter1.emit('transactionHash', hash1)
                }, 200)
                setTimeout(() => {
                    emitter1.emit('receipt', receipt1)
                }, 400)
                setTimeout(() => {
                    emitter2.emit('transactionHash', hash2)
                }, 600)
                setTimeout(() => {
                    emitter2.emit('receipt', receipt2)
                    resolve(null)
                }, 800)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals('1234', '18'),
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: false,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
        it('purchases the product when there is enough allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([actionsTypes.SUBSCRIPTION])
            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve(null)
                }, 400)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals('1234', '18'),
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: false,
                includeGasForResetAllowance: false,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
    })
    describe('ETH Purchase actions', () => {
        it('purchases the product', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.ETH,
                price: '1234',
            }
            const web3UtilsMock = web3Utils as any
            web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([actionsTypes.SUBSCRIPTION])
            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve(null)
                }, 400)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
    })
    describe('Custom token purchase actions', () => {
        it('purchases the product, resets existing allowance & sets allowance', async () => {
            let purchase

            function Test() {
                purchase = usePurchase()
                return null
            }

            mount(<Test />)
            const contractProduct = {
                id: '1',
                pricePerSecond: new BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                minimumSubscriptionInSeconds: '0',
                chainId: 1,
                pricingTokenAddress: '0x642D2B84A32A9A92FEc78CeAA9488388b3704898', // OtherCoin
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.PRODUCT_DEFINED,
                price: '1234',
            }
            const purchasePrice = priceUtils.priceForTimeUnits(
                contractProduct.pricePerSecond,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )
            const web3UtilsMock = web3Utils as any
            const validateStub = web3UtilsMock.validateBalanceForPurchase.mockImplementation(() => Promise.resolve())
            const result = await purchase({
                contractProduct,
                accessPeriod,
                gasIncrease: 123,
            })
            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.RESET_DATA_ALLOWANCE,
                actionsTypes.SET_DATA_ALLOWANCE,
                actionsTypes.SUBSCRIPTION,
            ])
            const emitter1 = new EventEmitter()
            const tx1 = new Transaction(emitter1)
            const hash1 = 'test1'
            const receipt1 = {
                transactionHash: hash1,
            }
            const emitter2 = new EventEmitter()
            const tx2 = new Transaction(emitter2)
            const hash2 = 'test2'
            const receipt2 = {
                transactionHash: hash2,
            }
            const emitter3 = new EventEmitter()
            const tx3 = new Transaction(emitter3)
            const hash3 = 'test3'
            const receipt3 = {
                transactionHash: hash3,
            }
            const addTransactionStub = jest.spyOn(transactionActions, 'addTransaction')
            const subscriptionStub = jest.spyOn(productActions, 'getProductSubscription')
            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter1.emit('transactionHash', hash1)
                }, 200)
                setTimeout(() => {
                    emitter1.emit('receipt', receipt1)
                }, 400)
                setTimeout(() => {
                    emitter2.emit('transactionHash', hash2)
                }, 600)
                setTimeout(() => {
                    emitter2.emit('receipt', receipt2)
                }, 800)
                setTimeout(() => {
                    emitter3.emit('transactionHash', hash3)
                }, 1000)
                setTimeout(() => {
                    emitter3.emit('receipt', receipt3)
                    resolve(null)
                }, 1200)
            })
            const startedFn = jest.fn()
            const statusFn = jest.fn()
            const readyFn = jest.fn()
            const finishFn = jest.fn()
            result.queue
                .subscribe('started', startedFn)
                .subscribe('status', statusFn)
                .subscribe('ready', readyFn)
                .subscribe('finish', finishFn)
            await Promise.all([txPromise, result.queue.start()])
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.RESET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(addTransactionStub).toHaveBeenCalledWith(hash1, transactionTypes.RESET_DATA_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash2, transactionTypes.SET_DATA_ALLOWANCE)
            expect(addTransactionStub).toHaveBeenCalledWith(hash3, transactionTypes.SUBSCRIPTION)
            expect(validateStub).toHaveBeenCalledWith({
                price: fromDecimals(purchasePrice, '18'),
                paymentCurrency: paymentCurrencies.PRODUCT_DEFINED,
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: true,
                pricingTokenAddress: '0x642D2B84A32A9A92FEc78CeAA9488388b3704898',
            })
            expect(subscriptionStub).toHaveBeenCalledWith('1', 1)
        })
    })
})
