import EventEmitter from 'events'

import Transaction from '$shared/utils/Transaction'

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
        expect(tx.emitter).toStrictEqual(emitter)
    })
    it('reacts to onTransactionHash', (done) => {
        tx.onTransactionHash((hash) => {
            expect('test').toBe(hash)
            done()
        })
        emitter.emit('transactionHash', 'test')
    })
    it('reacts to onTransactionComplete', (done) => {
        tx.onTransactionComplete((receipt) => {
            expect('test').toBe(receipt)
            done()
        })
        emitter.emit('receipt', 'test')
    })
    it('reacts to onError', (done) => {
        tx.onError((error) => {
            expect('test').toBe(error)
            done()
        })
        emitter.emit('error', 'test')
    })
})
