import EventEmitter from 'events'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon from 'sinon'
import BN from 'bignumber.js'

import Transaction from '$shared/utils/Transaction'
import usePublish, { publishModes } from '../usePublish'
import * as contractProductServices from '$mp/modules/contractProduct/services'
import * as dataUnionServices from '$mp/modules/dataUnion/services'
import * as transactionActions from '$mp/modules/transactions/actions'
import * as productServices from '$mp/modules/product/services'

import { actionsTypes } from '../publishQueue'
import { transactionStates, transactionTypes } from '$shared/utils/constants'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))

describe('usePublish', () => {
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

    describe('publish mode', () => {
        it('returns undefined if publish not called', () => {
            let result
            function Test() {
                result = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            expect(result.publishMode).toBeFalsy()
        })

        it('throws an error if there is no product', async () => {
            let result
            function Test() {
                result = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            await act(async () => {
                try {
                    await result.publish()
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('no product')
                }
            })
        })

        it('sets unpublish mode if no pending changes', async () => {
            let publish
            function Test() {
                publish = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            const product = {
                id: '1',
                state: 'DEPLOYED',
            }

            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })

            let result
            await act(async () => {
                result = await publish.publish(product)
            })

            expect(result.mode).toBe(publishModes.UNPUBLISH)
        })

        it('sets republish mode if there are pending changes', async () => {
            let publish
            function Test() {
                publish = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            const product = {
                id: '1',
                name: 'Old name',
                state: 'DEPLOYED',
                pendingChanges: {
                    name: 'New name',
                },
            }

            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })

            let result
            await act(async () => {
                result = await publish.publish(product)
            })

            expect(result.mode).toBe(publishModes.REPUBLISH)
        })

        it('sets publish mode if not deployed & no contract product', async () => {
            let publish
            function Test() {
                publish = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            const product = {
                id: '1',
                name: 'Name',
                state: 'NOT_DEPLOYED',
            }

            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })

            let result
            await act(async () => {
                result = await publish.publish(product)
            })

            expect(result.mode).toBe(publishModes.PUBLISH)
        })

        it('sets redeploy mode if not deployed & contract product', async () => {
            let publish
            function Test() {
                publish = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            const product = {
                id: '1',
                name: 'Name',
                state: 'NOT_DEPLOYED',
            }

            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve({
                id: '1',
            }))
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })

            let result
            await act(async () => {
                result = await publish.publish(product)
            })

            expect(result.mode).toBe(publishModes.REDEPLOY)
        })

        it('throws an error if unknown product state', async () => {
            let publish
            function Test() {
                publish = usePublish()
                return null
            }

            mount((
                <Test />
            ))

            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })

            let result
            await act(async () => {
                try {
                    result = await publish.publish({
                        id: '1',
                        name: 'Name',
                        state: 'DEPLOYING',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('Invalid product state')
                }
            })

            expect(result).toBeFalsy()

            await act(async () => {
                try {
                    result = await publish.publish({
                        id: '1',
                        name: 'Name',
                        state: 'UNDEPLOYING',
                    })
                    expect(true).toBe(false) // shouldn't come here
                } catch (e) {
                    expect(e).toBeTruthy()
                    expect(e.message).toBe('Invalid product state')
                }
            })

            expect(result).toBeFalsy()
        })
    })

    describe('publish actions', () => {
        describe('free data product', () => {
            it('publishes an unpublished free data product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                })

                expect(result.mode).toBe(publishModes.PUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.PUBLISH_FREE,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                sandbox.stub(productServices, 'postDeployFree').callsFake(() => Promise.resolve())

                await result.queue.start()

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                expect(finishFn).toHaveBeenCalled()
            })

            it('gives an error if postDeployFree fails', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                })

                expect(result.mode).toBe(publishModes.PUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.PUBLISH_FREE,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const error = new Error('something happened')
                sandbox.stub(productServices, 'postDeployFree').callsFake(() => {
                    throw error
                })

                await result.queue.start()

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE, transactionStates.FAILED, error)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_FREE)
                expect(finishFn).toHaveBeenCalled()
            })

            it('unpublishes a published free data product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'DEPLOYED',
                }

                let result
                await act(async () => {
                    result = await publish.publish(product)
                })

                expect(result.mode).toBe(publishModes.UNPUBLISH)
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UNPUBLISH_FREE,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                sandbox.stub(productServices, 'postUndeployFree').callsFake(() => Promise.resolve())

                await result.queue.start()

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE)
                expect(finishFn).toHaveBeenCalled()
            })

            it('gives an error if postUndeployFree throws an error', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'DEPLOYED',
                }

                let result
                await act(async () => {
                    result = await publish.publish(product)
                })

                expect(result.mode).toBe(publishModes.UNPUBLISH)
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UNPUBLISH_FREE,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const error = new Error('something happened')
                sandbox.stub(productServices, 'postUndeployFree').callsFake(() => {
                    throw error
                })

                await result.queue.start()

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE, transactionStates.FAILED, error)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UNPUBLISH_FREE)
                expect(finishFn).toHaveBeenCalled()
            })

            it('republishes a published free data product with pending changes', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const product = {
                    id: '1',
                    name: 'Name',
                    description: 'Description',
                    streams: ['1', '3'],
                    state: 'DEPLOYED',
                    pendingChanges: {
                        name: 'New name',
                        streams: ['2', '3', '4'],
                    },
                }

                let result
                await act(async () => {
                    result = await publish.publish(product)
                })

                expect(result.mode).toBe(publishModes.REPUBLISH)
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.PUBLISH_PENDING_CHANGES,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve())

                await result.queue.start()

                expect(putProductStub.calledWith({
                    id: '1',
                    name: 'New name',
                    description: 'Description',
                    streams: ['2', '3', '4'],
                    state: 'DEPLOYED',
                    pendingChanges: undefined,
                })).toBe(true)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(finishFn).toHaveBeenCalled()
            })
        })

        describe('paid data product', () => {
            it('publishes an unpublished paid data product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                })

                expect(result.mode).toBe(publishModes.PUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.CREATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'createContractProduct').callsFake(() => tx)
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })
                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('unpublishes a published paid data product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve({
                    id: '1',
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                }))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                })

                expect(result.mode).toBe(publishModes.UNPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'deleteProduct').callsFake(() => tx)
                const postSetUndeployingStub = sandbox.stub(productServices, 'postSetUndeploying').callsFake(() => Promise.resolve())
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT)
                expect(postSetUndeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash, transactionTypes.UNDEPLOY_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('redeploys an unpublished paid data product that has a contract product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve({
                    id: '1',
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                }))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                })

                expect(result.mode).toBe(publishModes.REDEPLOY)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.REDEPLOY_PAID,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'redeployProduct').callsFake(() => tx)
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.REDEPLOY_PAID)
                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash, transactionTypes.REDEPLOY_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.REDEPLOY_PAID, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.REDEPLOY_PAID, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.REDEPLOY_PAID)
                expect(finishFn).toHaveBeenCalled()
            })

            it('redeploys & updates contract info on an unpublished paid data product that has a contract product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(2),
                    beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                }
                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REDEPLOY)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const emitter1 = new EventEmitter()
                const tx1 = new Transaction(emitter1)
                const hash1 = 'test'
                const receipt1 = {
                    transactionHash: hash1,
                }
                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => tx1)
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter1.emit('transactionHash', hash1)
                    }, 200)
                    setTimeout(() => {
                        emitter1.emit('receipt', receipt1)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(startedFn).not.toHaveBeenCalledWith(actionsTypes.REDEPLOY_PAID)
                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pricePerSecond,
                    beneficiaryAddress: product.beneficiaryAddress,
                    priceCurrency: product.priceCurrency,
                }, true)).toBe(true)
                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash1, transactionTypes.UPDATE_CONTRACT_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('gives an error if contract update throws an error before starting', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(2),
                    beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                }
                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REDEPLOY)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const updateError = new Error('update failed')

                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => {
                    throw updateError
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

                await result.queue.start()

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pricePerSecond,
                    beneficiaryAddress: product.beneficiaryAddress,
                    priceCurrency: product.priceCurrency,
                })).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.FAILED, updateError)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('republishes a published paid data product that has no pending contract changes', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve({
                    id: '1',
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                }))
                const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve())

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    streams: ['1', '3'],
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pendingChanges: {
                        name: 'New name',
                        streams: ['2', '3', '4'],
                    },
                })

                expect(result.mode).toBe(publishModes.REPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.PUBLISH_PENDING_CHANGES,
                ])
                expect(result.queue.needsWeb3()).toBe(false)
                expect(result.queue.needsOwner()).toStrictEqual([])

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'redeployProduct').callsFake(() => tx)

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(putProductStub.calledWith({
                    id: '1',
                    name: 'New name',
                    streams: ['2', '3', '4'],
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pendingChanges: undefined,
                })).toBe(true)
                expect(finishFn).toHaveBeenCalled()
            })

            it('republishes a published paid data product that also has pending contract changes', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
                const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve())
                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }
                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => tx)
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const product = {
                    id: '1',
                    name: 'Name',
                    streams: ['1', '3'],
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pendingChanges: {
                        pricePerSecond: BN(2),
                        beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                        priceCurrency: 'EUR',
                        name: 'New name',
                        streams: ['2', '3', '4'],
                    },
                }
                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                    actionsTypes.PUBLISH_PENDING_CHANGES,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pendingChanges.pricePerSecond,
                    beneficiaryAddress: product.pendingChanges.beneficiaryAddress,
                    priceCurrency: product.pendingChanges.priceCurrency,
                })).toBe(true)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES, transactionStates.CONFIRMED)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(addTransactionStub.calledWith(hash, transactionTypes.UPDATE_CONTRACT_PRODUCT)).toBe(true)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(putProductStub.calledWith({
                    id: '1',
                    name: 'New name',
                    streams: ['2', '3', '4'],
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1), // contract info will be updated by the backend watcher
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pendingChanges: undefined,
                })).toBe(true)
                expect(finishFn).toHaveBeenCalled()
            })
        })

        describe('paid data union', () => {
            it('publishes an unpublished paid data union', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    type: 'DATAUNION',
                })

                expect(result.mode).toBe(publishModes.PUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.CREATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual([
                    '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                ])

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'createContractProduct').callsFake(() => tx)
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.CREATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('unpublishes a published paid data union', async () => {
                let publish
                function Test() {
                    publish = usePublish()
                    return null
                }

                mount((
                    <Test />
                ))

                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve({
                    id: '1',
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                }))
                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                sandbox.stub(contractProductServices, 'deleteProduct').callsFake(() => tx)
                const postSetUndeployingStub = sandbox.stub(productServices, 'postSetUndeploying').callsFake(() => Promise.resolve())
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const result = await publish.publish({
                    id: '1',
                    name: 'Name',
                    state: 'DEPLOYED',
                    isFree: false,
                    pricePerSecond: BN(1),
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    type: 'DATAUNION',
                })

                expect(result.mode).toBe(publishModes.UNPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT)
                expect(postSetUndeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash, transactionTypes.UNDEPLOY_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UNDEPLOY_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('redeploys & updates contract info on an unpublished paid data union that has a contract product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

                const emitter1 = new EventEmitter()
                const tx1 = new Transaction(emitter1)
                const hash1 = 'test'
                const receipt1 = {
                    transactionHash: hash1,
                }

                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => tx1)
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(2),
                    beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    type: 'DATAUNION',
                }
                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REDEPLOY)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter1.emit('transactionHash', hash1)
                    }, 200)
                    setTimeout(() => {
                        emitter1.emit('receipt', receipt1)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pricePerSecond,
                    beneficiaryAddress: product.beneficiaryAddress,
                    priceCurrency: product.priceCurrency,
                }, true)).toBe(true)
                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash1, transactionTypes.UPDATE_CONTRACT_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('redeploys & updates contract info, changes admin fee on an unpublished paid data union that has a contract product', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

                const emitter1 = new EventEmitter()
                const tx1 = new Transaction(emitter1)
                const hash1 = 'test'
                const receipt1 = {
                    transactionHash: hash1,
                }

                const emitter2 = new EventEmitter()
                const tx2 = new Transaction(emitter2)
                const hash2 = 'test2'
                const receipt2 = {
                    transactionHash: hash2,
                }

                const setAdminFeeStub = sandbox.stub(dataUnionServices, 'setAdminFee').callsFake(() => tx1)
                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => tx2)
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')
                const postSetDeployingStub = sandbox.stub(productServices, 'postSetDeploying').callsFake(() => Promise.resolve())

                const product = {
                    id: '1',
                    name: 'Name',
                    state: 'NOT_DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(2),
                    beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                    type: 'DATAUNION',
                    pendingChanges: {
                        adminFee: '0.2',
                    },
                }
                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REDEPLOY)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_ADMIN_FEE,
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

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

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(setAdminFeeStub.calledWith(product.beneficiaryAddress, product.pendingChanges.adminFee)).toBe(true)
                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pricePerSecond,
                    beneficiaryAddress: product.beneficiaryAddress,
                    priceCurrency: product.priceCurrency,
                }, true)).toBe(true)
                expect(postSetDeployingStub.calledWith('1')).toBe(true)
                expect(addTransactionStub.calledWith(hash1, transactionTypes.UPDATE_ADMIN_FEE)).toBe(true)
                expect(addTransactionStub.calledWith(hash2, transactionTypes.UPDATE_CONTRACT_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(finishFn).toHaveBeenCalled()
            })

            it('republishes a published data union that has a changed admin fee', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

                const emitter = new EventEmitter()
                const tx = new Transaction(emitter)
                const hash = 'test'
                const receipt = {
                    transactionHash: hash,
                }

                const setAdminFeeStub = sandbox.stub(dataUnionServices, 'setAdminFee').callsFake(() => tx)
                const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve())
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const product = {
                    id: '1',
                    name: 'Name',
                    streams: ['1', '3'],
                    state: 'DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(1),
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    type: 'DATAUNION',
                    pendingChanges: {
                        name: 'New name',
                        adminFee: '0.5',
                        streams: ['2', '3', '4'],
                    },
                }

                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_ADMIN_FEE,
                    actionsTypes.PUBLISH_PENDING_CHANGES,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

                const txPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        emitter.emit('transactionHash', hash)
                    }, 200)
                    setTimeout(() => {
                        emitter.emit('receipt', receipt)
                        resolve()
                    }, 400)
                })

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)

                expect(putProductStub.calledWith({
                    id: '1',
                    name: 'New name',
                    streams: ['2', '3', '4'],
                    state: 'DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(1),
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    type: 'DATAUNION',
                    pendingChanges: undefined,
                })).toBe(true)
                expect(setAdminFeeStub.calledWith('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0', '0.5')).toBe(true)
                expect(addTransactionStub.calledWith(hash, transactionTypes.UPDATE_ADMIN_FEE)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(finishFn).toHaveBeenCalled()
            })

            it('republishes a published data union that has a changed admin fee & contract data', async () => {
                let publish
                function Test() {
                    publish = usePublish()
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
                sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
                sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => Promise.resolve('0.3'))
                sandbox.stub(dataUnionServices, 'getDataUnionOwner')
                    .callsFake(() => Promise.resolve('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'))

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

                const setAdminFeeStub = sandbox.stub(dataUnionServices, 'setAdminFee').callsFake(() => tx1)
                const updateContractStub = sandbox.stub(contractProductServices, 'updateContractProduct').callsFake(() => tx2)
                const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve())
                const addTransactionStub = sandbox.stub(transactionActions, 'addTransaction')

                const product = {
                    id: '1',
                    name: 'Name',
                    streams: ['1', '3'],
                    state: 'DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(1),
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    type: 'DATAUNION',
                    pendingChanges: {
                        name: 'New name',
                        adminFee: '0.5',
                        streams: ['2', '3', '4'],
                        pricePerSecond: BN(2),
                        beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                        priceCurrency: 'EUR',
                    },
                }

                const result = await publish.publish(product)

                expect(result.mode).toBe(publishModes.REPUBLISH)
                expect(result.queue).toBeTruthy()
                expect(result.queue.getActions().map(({ id }) => id)).toStrictEqual([
                    actionsTypes.UPDATE_ADMIN_FEE,
                    actionsTypes.UPDATE_CONTRACT_PRODUCT,
                    actionsTypes.PUBLISH_PENDING_CHANGES,
                ])
                expect(result.queue.needsWeb3()).toBe(true)
                expect(result.queue.needsOwner()).toStrictEqual(['0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'])

                const startedFn = jest.fn()
                const statusFn = jest.fn()
                const readyFn = jest.fn()
                const finishFn = jest.fn()

                result.queue
                    .subscribe('started', startedFn)
                    .subscribe('status', statusFn)
                    .subscribe('ready', readyFn)
                    .subscribe('finish', finishFn)

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

                await Promise.all([
                    txPromise,
                    result.queue.start(),
                ])

                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(startedFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)

                expect(putProductStub.calledWith({
                    id: '1',
                    name: 'New name',
                    streams: ['2', '3', '4'],
                    state: 'DEPLOYED',
                    isFree: false,
                    ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    priceCurrency: 'DATA',
                    minimumSubscriptionInSeconds: '0',
                    pricePerSecond: BN(1),
                    beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                    type: 'DATAUNION',
                    pendingChanges: undefined,
                })).toBe(true)
                expect(updateContractStub.calledWith({
                    ...contractProduct,
                    pricePerSecond: product.pendingChanges.pricePerSecond,
                    beneficiaryAddress: product.pendingChanges.beneficiaryAddress,
                    priceCurrency: product.pendingChanges.priceCurrency,
                })).toBe(true)
                expect(setAdminFeeStub.calledWith('0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0', '0.5')).toBe(true)
                expect(addTransactionStub.calledWith(hash1, transactionTypes.UPDATE_ADMIN_FEE)).toBe(true)
                expect(addTransactionStub.calledWith(hash2, transactionTypes.UPDATE_CONTRACT_PRODUCT)).toBe(true)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_ADMIN_FEE)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.PENDING)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.UPDATE_CONTRACT_PRODUCT)
                expect(statusFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES, transactionStates.CONFIRMED)
                expect(readyFn).toHaveBeenCalledWith(actionsTypes.PUBLISH_PENDING_CHANGES)
                expect(finishFn).toHaveBeenCalled()
            })
        })
    })
})
