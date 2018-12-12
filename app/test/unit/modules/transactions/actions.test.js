import assert from 'assert-diff'
import sinon from 'sinon'

import * as actions from '$mp/modules/transactions/actions'
import * as constants from '$mp/modules/transactions/constants'
import { transactionTypes } from '$shared/utils/constants'
import * as services from '$mp/modules/transactions/services'
import * as entitiesActions from '$shared/modules/entities/actions'
import * as notificationActions from '$mp/modules/notifications/actions'
import mockStore from '$testUtils/mockStoreProvider'

describe('transactions - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('addTransaction', () => {
        it('updates transaction succesfully', async () => {
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            sandbox.stub(notificationActions, 'showTransactionNotification').callsFake(() => ({
                type: 'showTransactionNotification',
            }))
            const addTransactionToSessionStorageSpy = sandbox.spy(services, 'addTransactionToSessionStorage')

            const txHash = 'hash'
            const type = 'testType'
            const store = mockStore()
            store.dispatch(actions.addTransaction(txHash, type))

            const expectedActions = [
                {
                    type: 'updateEntities',
                },
                {
                    type: constants.ADD_TRANSACTION,
                    payload: {
                        id: txHash,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(addTransactionToSessionStorageSpy.calledWith(
                txHash,
                type,
            ))
        })

        const allowedNotifications = [
            transactionTypes.PURCHASE,
            transactionTypes.UNDEPLOY_PRODUCT,
            transactionTypes.REDEPLOY_PRODUCT,
            transactionTypes.CREATE_CONTRACT_PRODUCT,
            transactionTypes.UPDATE_CONTRACT_PRODUCT,
        ]

        Object.values(transactionTypes).forEach((type) => {
            it(`adds transaction and handles notification correctly (${type})`, () => {
                sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                    type: 'updateEntities',
                }))
                sandbox.stub(notificationActions, 'showTransactionNotification').callsFake(() => ({
                    type: 'showTransactionNotification',
                }))
                const addTransactionToSessionStorageSpy = sandbox.spy(services, 'addTransactionToSessionStorage')

                const txHash = 'hash'
                const store = mockStore()
                store.dispatch(actions.addTransaction(txHash, type))

                const expectedActions = [
                    {
                        type: 'updateEntities',
                    },
                    {
                        type: constants.ADD_TRANSACTION,
                        payload: {
                            id: txHash,
                        },
                    },
                ]

                if (allowedNotifications.indexOf(type) >= 0) {
                    expectedActions.push({
                        type: 'showTransactionNotification',
                    })
                }

                assert.deepStrictEqual(store.getActions(), expectedActions)
                assert(addTransactionToSessionStorageSpy.calledWith(
                    txHash,
                    type,
                ))
            })
        })
    })

    describe('completeTransaction', () => {
        it('completes the transaction', () => {
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = sandbox.spy(services, 'removeTransactionFromSessionStorage')

            const txHash = 'hash'
            const receipt = 'receipt'
            const store = mockStore()
            store.dispatch(actions.completeTransaction(txHash, receipt))

            const expectedActions = [
                {
                    type: 'updateEntities',
                },
                {
                    type: constants.COMPLETE_TRANSACTION,
                    payload: {
                        id: txHash,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(removeTransactionFromSessionStorageSpy.calledWith(txHash))
        })
    })

    describe('transactionError', () => {
        it('adds transaction error', () => {
            sandbox.stub(entitiesActions, 'updateEntities').callsFake(() => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = sandbox.spy(services, 'removeTransactionFromSessionStorage')

            const txHash = 'hash'
            const error = 'error'
            const store = mockStore()
            store.dispatch(actions.transactionError(txHash, error))

            const expectedActions = [
                {
                    type: 'updateEntities',
                },
                {
                    type: constants.COMPLETE_TRANSACTION,
                    payload: {
                        id: txHash,
                    },
                },
            ]

            assert.deepStrictEqual(store.getActions(), expectedActions)
            assert(removeTransactionFromSessionStorageSpy.calledWith(txHash))
        })
    })
})
