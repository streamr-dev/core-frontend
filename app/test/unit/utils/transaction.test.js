import EventEmitter from 'events'
import assert from 'assert-diff'

import Transaction from '../../../src/utils/Transaction'

describe('Transaction', () => {
    let emitter
    let tx
    beforeEach(() => {
        emitter = new EventEmitter()
        tx = new Transaction(emitter)
    })
    afterEach(() => {
        emitter = undefined
        tx = undefined
    })

    it('uses the emitter it gets in constructor', () => {
        assert.equal(tx.emitter, emitter)
    })
    it('reacts to onTransactionHash', (done) => {
        tx.onTransactionHash((hash) => {
            assert.equal('test', hash)
            done()
        })
        emitter.emit('transactionHash', 'test')
    })
    it('reacts to onTransactionComplete', (done) => {
        tx.onTransactionComplete((receipt) => {
            assert.equal('test', receipt)
            done()
        })
        emitter.emit('receipt', 'test')
    })
    it('reacts to onError', (done) => {
        tx.onError((error) => {
            assert.equal('test', error)
            done()
        })
        emitter.emit('error', 'test')
    })
})
