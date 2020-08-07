import EventEmitter from 'events'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon from 'sinon'
import BN from 'bignumber.js'

import Transaction from '$shared/utils/Transaction'
import { transactionStates, paymentCurrencies, transactionTypes } from '$shared/utils/constants'
import usePurchase, { actionsTypes } from '../usePurchase'
import * as priceUtils from '$mp/utils/price'
import * as web3Utils from '$mp/utils/web3'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as productServices from '$mp/modules/product/services'
import * as productActions from '$mp/modules/product/actions'

const mockState = {
    global: {
        dataPerUsd: 10,
    },
}

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation((selectorFn) => selectorFn(mockState)),
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))

describe('usePurchase', () => {
    let sandbox

    beforeAll(() => {
        // don't show error as console.error
        jest.spyOn(console, 'error')
        console.error.mockImplementation((...args) => console.warn(...args))
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    afterAll(() => {
        console.error.mockRestore()
    })

    describe('input errors', () => {
        it('throws an error if contract product not found', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            await act(async () => {
                try {
                    await result.purchase()
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no product')
                }
            })
        })

        it('throws an error if dataPerUsd is not defined', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no dataPerUsd')
                }
            })
        })

        it('throws an error if access period is not defined', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        dataPerUsd: '10',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })
        })

        it('throws an error if currency is DATA and price cannot be calculated', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
            }
            sandbox.stub(priceUtils, 'dataForTimeUnits').callsFake(() => undefined)

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod,
                        dataPerUsd: '10',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('could not calculate price')
                }
            })
        })

        it('throws an error if currency is ETH or DAI and price not defined', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 1,
                            timeUnit: 'hour',
                            paymentCurrency: paymentCurrencies.ETH,
                        },
                        dataPerUsd: '10',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no price')
                }
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 1,
                            timeUnit: 'hour',
                            paymentCurrency: paymentCurrencies.DAI,
                        },
                        dataPerUsd: '10',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no price')
                }
            })
        })

        it('throws an error if no balance available', async () => {
            let result
            function Test() {
                result = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.ETH,
                price: '1234',
            }
            sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => {
                throw new Error('no balance')
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod,
                        dataPerUsd: '10',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no balance')
                }
            })
        })
    })

    describe('DATA Purchase actions', () => {
        it('purchases the product, resets existing allowance & sets allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const dataPerUsd = '10'
            const purchasePrice = priceUtils.dataForTimeUnits(
                contractProduct.pricePerSecond,
                dataPerUsd,
                contractProduct.priceCurrency,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )

            sandbox.stub(productServices, 'getMyDataAllowance').callsFake(() => Promise.resolve(BN(20)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd,
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

            let callCount = 0
            const setAllowanceStub = sandbox.stub(productServices, 'setMyDataAllowance').callsFake(() => {
                if (callCount === 0) {
                    callCount += 1
                    return tx1
                }

                return tx2
            })
            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx3)
            const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

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
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

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
            expect(addTransactionStub.calledWith(hash1, transactionTypes.RESET_DATA_ALLOWANCE)).toBe(true)
            expect(addTransactionStub.calledWith(hash2, transactionTypes.SET_DATA_ALLOWANCE)).toBe(true)
            expect(addTransactionStub.calledWith(hash3, transactionTypes.SUBSCRIPTION)).toBe(true)
            expect(setAllowanceStub.calledWith('0')).toBe(true)
            expect(setAllowanceStub.calledWith(purchasePrice)).toBe(true)
            expect(validateStub.calledWith({
                price: purchasePrice,
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: true,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DATA', purchasePrice)).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })

        it('purchases the product & sets allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const dataPerUsd = '10'
            const purchasePrice = priceUtils.dataForTimeUnits(
                contractProduct.pricePerSecond,
                dataPerUsd,
                contractProduct.priceCurrency,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )

            sandbox.stub(productServices, 'getMyDataAllowance').callsFake(() => Promise.resolve(BN(0)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd,
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

            const setAllowanceStub = sandbox.stub(productServices, 'setMyDataAllowance').callsFake(() => tx1)
            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx2)
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

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
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DATA_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(setAllowanceStub.calledWith(purchasePrice)).toBe(true)
            expect(validateStub.calledWith({
                price: purchasePrice,
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: false,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DATA', purchasePrice)).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })

        it('purchases the product when there is enough allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DATA,
                price: '1234',
            }
            const dataPerUsd = '10'
            const purchasePrice = priceUtils.dataForTimeUnits(
                contractProduct.pricePerSecond,
                dataPerUsd,
                contractProduct.priceCurrency,
                accessPeriod.time,
                accessPeriod.timeUnit,
            )

            sandbox.stub(productServices, 'getMyDataAllowance').callsFake(() => Promise.resolve(BN(5000)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd,
            })

            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.SUBSCRIPTION,
            ])

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx)
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub.calledWith({
                price: purchasePrice,
                paymentCurrency: 'DATA',
                includeGasForSetAllowance: false,
                includeGasForResetAllowance: false,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DATA', purchasePrice)).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })
    })

    describe('DAI Purchase actions', () => {
        it('purchases the product, resets existing allowance & sets allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }

            sandbox.stub(productServices, 'getMyDaiAllowance').callsFake(() => Promise.resolve(BN(20)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd: '10',
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

            let callCount = 0
            const setAllowanceStub = sandbox.stub(productServices, 'setMyDaiAllowance').callsFake(() => {
                if (callCount === 0) {
                    callCount += 1
                    return tx1
                }

                return tx2
            })
            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx3)
            const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

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
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

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
            expect(addTransactionStub.calledWith(hash1, transactionTypes.RESET_DAI_ALLOWANCE)).toBe(true)
            expect(addTransactionStub.calledWith(hash2, transactionTypes.SET_DAI_ALLOWANCE)).toBe(true)
            expect(addTransactionStub.calledWith(hash3, transactionTypes.SUBSCRIPTION)).toBe(true)
            expect(setAllowanceStub.calledWith('0')).toBe(true)
            expect(setAllowanceStub.calledWith('1234')).toBe(true)
            expect(validateStub.calledWith({
                price: '1234',
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: true,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DAI', '1234')).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })

        it('purchases the product & sets allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }

            sandbox.stub(productServices, 'getMyDaiAllowance').callsFake(() => Promise.resolve(BN(0)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd: '10',
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

            const setAllowanceStub = sandbox.stub(productServices, 'setMyDaiAllowance').callsFake(() => tx1)
            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx2)
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

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
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE, transactionStates.CONFIRMED)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SET_DAI_ALLOWANCE)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(setAllowanceStub.calledWith('1234')).toBe(true)
            expect(validateStub.calledWith({
                price: '1234',
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: true,
                includeGasForResetAllowance: false,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DAI', '1234')).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })

        it('purchases the product when there is enough allowance', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.DAI,
                price: '1234',
            }

            sandbox.stub(productServices, 'getMyDaiAllowance').callsFake(() => Promise.resolve(BN(5000)))
            const validateStub = sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd: '10',
            })

            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.SUBSCRIPTION,
            ])

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx)
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(validateStub.calledWith({
                price: '1234',
                paymentCurrency: 'DAI',
                includeGasForSetAllowance: false,
                includeGasForResetAllowance: false,
            })).toBe(true)
            expect(buyProductStub.calledWith('1', '3600', 'DAI', '1234')).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })
    })

    describe('ETH Purchase actions', () => {
        it('purchases the product', async () => {
            let publish
            function Test() {
                publish = usePurchase()
                return null
            }

            mount((
                <Test />
            ))

            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            const accessPeriod = {
                time: 1,
                timeUnit: 'hour',
                paymentCurrency: paymentCurrencies.ETH,
                price: '1234',
            }

            sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())

            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
                dataPerUsd: '10',
            })

            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.SUBSCRIPTION,
            ])

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            const buyProductStub = sandbox.stub(productServices, 'buyProduct').callsFake(() => tx)
            const subscriptionStub = sandbox.stub(productActions, 'getProductSubscription')

            const txPromise = new Promise((resolve) => {
                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                }, 200)
                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                    resolve()
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

            await Promise.all([
                txPromise,
                result.queue.start(),
            ])

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.SUBSCRIPTION)
            expect(finishFn).toHaveBeenCalled()
            expect(buyProductStub.calledWith('1', '3600', 'ETH', '1234')).toBe(true)
            expect(subscriptionStub.calledWith('1')).toBe(true)
        })
    })
})
