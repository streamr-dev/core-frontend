import assert from 'assert-diff'

import TransactionError from '../../../src/errors/TransactionError'

describe('TransactionFailedError', () => {
    it('must extend Error', () => {
        // This is tested because of a bug in babel
        assert(new TransactionError('moi', 'receipt') instanceof Error)
    })
    it('must be instanceof itself', () => {
        // This is tested because of a bug in babel
        assert(new TransactionError('moi', 'receipt') instanceof TransactionError)
    })
    it('must give the receipt on getReceipt', () => {
        assert.equal(new TransactionError('moi', 'receipt').getReceipt(), 'receipt')
    })
})
