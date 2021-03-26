import * as storageUtils from '$shared/utils/storage'
import * as all from '$shared/utils/transactions'

describe('purchase - services', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('getTransactionsFromSessionStorage', () => {
        it('gets empty transactions object if session storage is available', async () => {
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => true)

            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({})
        })

        it('gets empty transactions object if session storage is not available', async () => {
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => false)

            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({})
        })

        it('gets transactions if session storage is available and transactions exist', async () => {
            const transactions = {
                hash: 'setAllowance',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => true)

            expect(all.getTransactionsFromSessionStorage()).toStrictEqual(transactions)
        })

        it('gets empty transactions object if session storage is not available and transactions exist', async () => {
            const transactions = {
                hash: 'setAllowance',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => false)

            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({})
        })
    })

    describe('addTransactionToSessionStorage', () => {
        it('adds transactions to session storage if available', () => {
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => true)

            all.addTransactionToSessionStorage('hash', 'type')

            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({
                hash: 'type',
            })
        })

        it('it does nothing if session storage is not available', () => {
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => false)

            all.addTransactionToSessionStorage('hash', 'type')
            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({})
        })
    })

    describe('removeTransactionFromSessionStorage', () => {
        it('removes transaction if session storage is available', () => {
            const transactions = {
                hash1: 'setAllowance',
                hash2: 'purchase',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => true)

            all.removeTransactionFromSessionStorage('hash2')
            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({
                hash1: 'setAllowance',
            })
        })

        it('does nothing if session storage is not available', () => {
            const transactions = {
                hash1: 'setAllowance',
                hash2: 'purchase',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            jest.spyOn(storageUtils, 'isSessionStorageAvailable').mockImplementation(() => false)

            all.removeTransactionFromSessionStorage('hash2')
            expect(all.getTransactionsFromSessionStorage()).toStrictEqual({})
        })
    })
})
