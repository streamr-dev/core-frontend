import EventEmitter from 'events'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon from 'sinon'
import BN from 'bignumber.js'

import Transaction from '$shared/utils/Transaction'
import { transactionStates, paymentCurrencies } from '$shared/utils/constants'
import usePurchase, { actionsTypes } from '../usePurchase'
import * as priceUtils from '$mp/utils/price'
import * as web3Utils from '$mp/utils/web3'
import * as purchaseServices from '$mp/modules/purchase/services'

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
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod: {},
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 0,
                            timeUnit: undefined,
                        },
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod: {
                            time: 1,
                            timeUnit: 'hour',
                        },
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no access period')
                }
            })
        })

        it('throws an error if price cannot be calculated', async () => {
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
            }
            sandbox.stub(priceUtils, 'dataForTimeUnits').callsFake(() => undefined)

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('could not calculate price')
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
            }
            sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => {
                throw new Error('no balance')
            })

            await act(async () => {
                try {
                    await result.purchase({
                        contractProduct,
                        accessPeriod,
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no balance')
                }
            })
        })
    })

    describe('Purchase actions', () => {
        it('purchases the product with eth', async () => {
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
            }

            sandbox.stub(web3Utils, 'validateBalanceForPurchase').callsFake(() => Promise.resolve())
            const result = await publish.purchase({
                contractProduct,
                accessPeriod,
            })

            expect(result.queue).toBeTruthy()
            expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                actionsTypes.PURCHASE,
            ])

            const emitter = new EventEmitter()
            const tx = new Transaction(emitter)
            const hash = 'test'
            const receipt = {
                transactionHash: hash,
            }

            sandbox.stub(purchaseServices, 'buyProduct').callsFake(() => tx)

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

            expect(startedFn).toHaveBeenCalledWith(actionsTypes.PURCHASE)
            expect(statusFn).toHaveBeenCalledWith(actionsTypes.PURCHASE, transactionStates.CONFIRMED)
            expect(readyFn).toHaveBeenCalledWith(actionsTypes.PURCHASE)
            expect(finishFn).toHaveBeenCalled()
        })
    })
})
