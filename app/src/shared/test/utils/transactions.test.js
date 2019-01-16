import assert from 'assert-diff'
import sinon from 'sinon'

import * as storageUtils from '$shared/utils/storage'
import * as all from '$shared/utils/transactions'

describe('purchase - services', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getTransactionsFromSessionStorage', () => {
        it('gets empty transactions object if session storage is available', async () => {
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => true)

            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {})
        })

        it('gets empty transactions object if session storage is not available', async () => {
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => false)

            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {})
        })

        it('gets transactions if session storage is available and transactions exist', async () => {
            const transactions = {
                hash: 'setAllowance',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => true)

            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), transactions)
        })

        it('gets empty transactions object if session storage is not available and transactions exist', async () => {
            const transactions = {
                hash: 'setAllowance',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => false)

            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {})
        })
    })

    describe('addTransactionToSessionStorage', () => {
        it('adds transactions to session storage if available', () => {
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => true)

            all.addTransactionToSessionStorage('hash', 'type')

            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {
                hash: 'type',
            })
        })

        it('it does nothing if session storage is not available', () => {
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => false)

            all.addTransactionToSessionStorage('hash', 'type')
            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {})
        })
    })

    describe('removeTransactionFromSessionStorage', () => {
        it('removes transaction if session storage is available', () => {
            const transactions = {
                hash1: 'setAllowance',
                hash2: 'purchase',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => true)

            all.removeTransactionFromSessionStorage('hash2')
            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {
                hash1: 'setAllowance',
            })
        })

        it('does nothing if session storage is not available', () => {
            const transactions = {
                hash1: 'setAllowance',
                hash2: 'purchase',
            }
            sessionStorage.setItem('pendingTransactions', JSON.stringify(transactions))
            sandbox.stub(storageUtils, 'isSessionStorageAvailable').callsFake(() => false)

            all.removeTransactionFromSessionStorage('hash2')
            assert.deepStrictEqual(all.getTransactionsFromSessionStorage(), {})
        })
    })
})
