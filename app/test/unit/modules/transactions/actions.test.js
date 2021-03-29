import Notification from '$shared/utils/Notification'
import * as actions from '$mp/modules/transactions/actions'
import * as constants from '$mp/modules/transactions/constants'
import { transactionTypes } from '$shared/utils/constants'
import * as transactionUtils from '$shared/utils/transactions'
import * as entitiesActions from '$shared/modules/entities/actions'
import mockStore from '$testUtils/mockStoreProvider'

describe('transactions - actions', () => {
    beforeEach(() => {
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('addTransaction', () => {
        it('updates transaction succesfully', async () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
                type: 'updateEntities',
            }))

            const addTransactionToSessionStorageSpy = jest.spyOn(transactionUtils, 'addTransactionToSessionStorage')

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

            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(addTransactionToSessionStorageSpy).toBeCalledWith(
                txHash,
                type,
            )
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
                jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
                    type: 'updateEntities',
                }))
                const notificationStub = jest.fn()
                jest.spyOn(Notification, 'push').mockImplementation(notificationStub)
                const addTransactionToSessionStorageSpy = jest.spyOn(transactionUtils, 'addTransactionToSessionStorage')

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
                    expect(notificationStub).toBeCalledWith({
                        txHash: 'hash',
                    })
                }

                expect(store.getActions()).toStrictEqual(expectedActions)
                expect(addTransactionToSessionStorageSpy).toBeCalledWith(
                    txHash,
                    type,
                )
            })
        })
    })

    describe('completeTransaction', () => {
        it('completes the transaction', () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = jest.spyOn(transactionUtils, 'removeTransactionFromSessionStorage')

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

            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(removeTransactionFromSessionStorageSpy).toBeCalledWith(txHash)
        })
    })

    describe('transactionError', () => {
        it('adds transaction error', () => {
            jest.spyOn(entitiesActions, 'updateEntities').mockImplementation(() => ({
                type: 'updateEntities',
            }))
            const removeTransactionFromSessionStorageSpy = jest.spyOn(transactionUtils, 'removeTransactionFromSessionStorage')

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

            expect(store.getActions()).toStrictEqual(expectedActions)
            expect(removeTransactionFromSessionStorageSpy).toBeCalledWith(txHash)
        })
    })
})
