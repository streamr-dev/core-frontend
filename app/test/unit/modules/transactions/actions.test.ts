import Notification from '$shared/utils/Notification'
import * as actions from '$mp/modules/transactions/actions'
import * as constants from '$mp/modules/transactions/constants'
import { transactionTypes } from '$shared/utils/constants'
import * as transactionUtils from '$shared/utils/transactions'
import * as entitiesActions from '$shared/modules/entities/actions'
import mockStore from '$app/test/test-utils/mockStoreProvider'
import TransactionError from '$shared/errors/TransactionError'

describe('transactions - actions', () => {
    beforeEach(() => {})
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    describe('addTransaction', () => {
        it('updates transaction succesfully', async () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation((): any => ({
                type: 'updateEntities',
            }))
            const addTransactionToSessionStorageSpy = jest.spyOn(transactionUtils, 'addTransactionToSessionStorage')
            const txHash = 'hash'
            const type = 'testType'
            const store = mockStore()
            actions.addTransaction(txHash, type)(store.dispatch)
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
            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(addTransactionToSessionStorageSpy).toBeCalledWith(txHash, type)
        })
        const allowedNotifications = [
            transactionTypes.UNDEPLOY_PRODUCT,
            transactionTypes.REDEPLOY_PRODUCT,
            transactionTypes.CREATE_CONTRACT_PRODUCT,
            transactionTypes.UPDATE_CONTRACT_PRODUCT,
        ]
        Object.values(transactionTypes).forEach((type) => {
            it(`adds transaction and handles notification correctly (${type})`, () => {
                jest.spyOn(entitiesActions, 'updateEntities').mockImplementation((): any => ({
                    type: 'updateEntities',
                }))
                const notificationStub = jest.fn()
                jest.spyOn(Notification, 'push').mockImplementation(notificationStub)
                const addTransactionToSessionStorageSpy = jest.spyOn(transactionUtils, 'addTransactionToSessionStorage')
                const txHash = 'hash'
                const store = mockStore()
                actions.addTransaction(txHash, type)(store.dispatch)
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
                    expect(notificationStub).toBeCalledWith({
                        txHash: 'hash',
                    })
                }

                expect(store.getActions()).toStrictEqual(expectedActions)
                expect(addTransactionToSessionStorageSpy).toBeCalledWith(txHash, type)
            })
        })
    })
    describe('completeTransaction', () => {
        it('completes the transaction', () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation((): any => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = jest.spyOn(
                transactionUtils,
                'removeTransactionFromSessionStorage',
            )
            const txHash = 'hash'
            const receipt = 'receipt'
            const store = mockStore()
            actions.completeTransaction(txHash, {transactionHash: receipt})(store.dispatch)
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
            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(removeTransactionFromSessionStorageSpy).toBeCalledWith(txHash)
        })
    })
    describe('transactionError', () => {
        it('adds transaction error', () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation((): any => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = jest.spyOn(
                transactionUtils,
                'removeTransactionFromSessionStorage',
            )
            const txHash = 'hash'
            const error = 'error'
            const store = mockStore()
            actions.transactionError(txHash, new TransactionError(error))(store.dispatch)
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
            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(removeTransactionFromSessionStorageSpy).toBeCalledWith(txHash)
        })
    })
})
