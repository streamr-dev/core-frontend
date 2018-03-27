import assert from 'assert-diff'
import sinon from 'sinon'
import EventEmitter from 'events'
import * as getWeb3 from '../../../web3/web3Provider'

import * as all from '../../../utils/smartContract'

describe('smartContract utils', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })

    describe('getContract', () => {
        it('must return the correct contract', async () => {
            const contractAddress = '0x123456789'
            const abi = [{}]
            class Test {}
            const contractSpy = sandbox.spy((() => sandbox.createStubInstance(Test)))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                eth: {
                    Contract: contractSpy
                }
            }))
            const contract = all.getContract(contractAddress, abi)
            assert(contract instanceof Test)
            assert(contractSpy.calledOnce)
            assert(contractSpy.calledWithNew())
            assert(contractSpy.calledWith(abi, contractAddress, {
                gas: 200000
            }))
        })
    })

    describe('call', () => {
        it('must return the right thing', () => {
            const stub = sandbox.stub().callsFake(() => 'test')
            const method = {
                call: stub
            }
            const callResult = all.call(method)
            assert.equal('test', callResult)
        })
    })

    describe('send', () => {
        let accountSpy

        beforeEach(() => {
            accountSpy = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountSpy
            }))
        })

        afterEach(()  => {
            accountSpy = undefined
        })

        it('must return a Transaction', () => {
            const fakeEmitter = {
                on: () => fakeEmitter,
                off: () => fakeEmitter
            }
            const method = {
                send: () => fakeEmitter
            }
            assert(all.send(method) instanceof all.Transaction)
        })

        describe('error', () => {
            it('must bind errorHandler before receipt', (done) => {
                const emitter = new EventEmitter()
                emitter.off = emitter.removeListener
                const method = {
                    send: () => emitter
                }

                all.send(method)
                    .onError((e) => {
                        assert.equal('test', e)
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('error', 'test')
                })
            })
            it('must bind new errorHandler after receipt', (done) => {
                const receipt = 'receipt'
                const emitter = new EventEmitter()
                emitter.off = emitter.removeListener
                const error = new Error('test')
                const hash = '0x000'
                const method = {
                    send: () => emitter
                }
                all.send(method)
                    .onError((e) => {
                        assert(e instanceof all.TransactionFailedError)
                        assert.equal('test', e.message)
                        assert.equal(receipt, e.getReceipt())
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('transactionHash', hash)
                    emitter.emit('error', error, receipt)
                })
            })
        })

        describe('transactionHash', () => {
            it('must work correctly', (done) => {
                const emitter = new EventEmitter()
                emitter.off = emitter.removeListener
                const method = {
                    send: () => emitter
                }
                all.send(method)
                    .onTransactionHash((hash) => {
                        assert.equal('test', hash)
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('transactionHash', 'test')
                })
            })
        })

        describe('receipt', () => {
            it('must emit transactionComplete', (done) => {
                const emitter = new EventEmitter()
                const receipt = {
                    status: '0x1',
                    test: 'test'
                }
                const method = {
                    send: () => emitter
                }
                all.send(method)
                    .onTransactionComplete((receipt) => {
                        assert.equal('test', receipt.test)
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                })
            })
            it('must emit error if receipt.status === 0', (done) => {
                const emitter = new EventEmitter()
                const receipt = {
                    status: '0x0',
                    test: 'test'
                }
                const method = {
                    send: () => emitter
                }
                all.send(method)
                    .onTransactionComplete(() => {
                        assert(false)
                    })
                    .onError((e) => {
                        assert(e instanceof all.TransactionFailedError)
                        assert.equal('Transaction failed', e.message)
                        assert.equal(receipt, e.getReceipt())
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                })
            })
        })
    })

    describe('TransactionFailedError', () => {
        it('must extend Error', () => {
            // This is tested because of a bug in babel
            assert(new all.TransactionFailedError('moi', 'receipt') instanceof Error)
        })
        it('must be instanceof itself', () => {
            // This is tested because of a bug in babel
            assert(new all.TransactionFailedError('moi', 'receipt') instanceof all.TransactionFailedError)
        })
        it('must give the receipt on getReceipt', () => {
            assert.equal(new all.TransactionFailedError('moi', 'receipt').getReceipt(), 'receipt')
        })
    })

    describe('Transaction', () => {
        let emitter
        let tx
        beforeEach(() => {
            emitter = new EventEmitter()
            tx = new all.Transaction(emitter)
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
})
