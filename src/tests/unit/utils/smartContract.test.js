import assert from 'assert-diff'
import sinon from 'sinon'
import EventEmitter from 'events'
import * as getWeb3 from '../../../web3/web3Provider'
import importedCommonConfig from '../../../web3/common.config'

import * as all from '../../../utils/smartContract'
import Transaction from '../../../utils/Transaction'
import TransactionError from '../../../errors/TransactionError'

describe('smartContract utils', () => {
    let sandbox
    let commonConfig
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
        commonConfig = {
            ...importedCommonConfig
        }
    })

    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })

    describe('hexEqualsZero', () => {
        it('must return true when 0 with 0x prefix', () => {
            assert(all.hexEqualsZero('0x0000000000000000000000000000000'))
        })
        it('must return true when 0 without 0x prefix', () => {
            assert(all.hexEqualsZero('000000000000000000000000000000000'))
        })
        it('must return false when other than 0 with 0x prefix', () => {
            assert(!all.hexEqualsZero('0x3123123123123123123123123123123123'))
            assert(!all.hexEqualsZero('0x0000000000000000000000000000000002'))
        })
        it('must return false when other than 0 without 0x prefix', () => {
            assert(!all.hexEqualsZero('3123123123123123123123123123123123'))
            assert(!all.hexEqualsZero('0000000000000000000000000000000002'))
        })
        it('must return false with invalid strings', () => {
            assert(!all.hexEqualsZero('0x'))
            assert(!all.hexEqualsZero(''))
            assert(!all.hexEqualsZero(undefined))
            assert(!all.hexEqualsZero(null))
            assert(!all.hexEqualsZero(8))
        })
    })

    describe('asciiToHex', () => {
        it('must call the right method', (done) => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                utils: {
                    asciiToHex: (a) => done(assert('test', a))
                }
            }))
            all.asciiToHex('test')
        })
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
            const contract = all.getContract({
                environments: {
                    test: {
                        address: contractAddress
                    }
                },
                abi
            })
            assert(contract instanceof Test)
            assert(contractSpy.calledOnce)
            assert(contractSpy.calledWithNew())
            assert(contractSpy.calledWith(abi, contractAddress))
        })
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            commonConfig.environments.test = {
                networkId: 1
            }
            await all.checkEthereumNetworkIsCorrect({
                getEthereumNetwork: () => Promise.resolve(1)
            })
        })

        it('must fail if required network is not the same as the actual network', async (done) => {
            commonConfig.environments.test = {
                networkId: 2
            }
            try {
                await all.checkEthereumNetworkIsCorrect({
                    getEthereumNetwork: () => Promise.resolve(1)
                })
            } catch (e) {
                done()
            }
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
        let accountStub
        let networkStub

        beforeEach(() => {
            commonConfig.environments.test.networkId = 1
            accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
                getEthereumNetwork: networkStub
            }))
        })

        afterEach(()  => {
            accountStub = undefined
        })

        it('must return a Transaction', () => {
            const fakeEmitter = {
                on: () => fakeEmitter,
                off: () => fakeEmitter
            }
            const method = {
                send: () => fakeEmitter
            }
            assert(all.send(method) instanceof Transaction)
        })

        it('must ask for the default address and send the transaction with it', (done) => {
            const dummyEmitter = {
                on: () => dummyEmitter,
                off: () => dummyEmitter
            }
            all.send({
                send: ({from}) => {
                    done(assert.equal('testAccount', from))
                    return dummyEmitter
                }
            })
        })

        it('must fail if checkEthereumNetworkIsCorrect fails', (done) => {
            networkStub = sandbox.stub().callsFake(() => Promise.resolve(2))
            const dummyEmitter = {
                on: () => dummyEmitter,
                off: () => dummyEmitter
            }
            all.send({
                send: () => dummyEmitter
            })
                .onError((e) => {
                    assert(e.message.match(/network/i))
                    done()
                })
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
                        assert(e instanceof TransactionError)
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
                        assert(e instanceof TransactionError)
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
})
