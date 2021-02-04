import EventEmitter from 'events'
import assert from 'assert-diff'
import sinon from 'sinon'

import * as getWeb3 from '$shared/web3/web3Provider'
import * as getConfig from '$shared/web3/config'
import * as all from '$mp/utils/smartContract'
import Transaction from '$shared/utils/Transaction'
import TransactionError from '$shared/errors/TransactionError'

const PromiEvent = () => {
    const promiEvent = Promise.resolve()
    const emitter = new EventEmitter()

    // eslint-disable-next-line no-underscore-dangle
    promiEvent._events = emitter._events
    promiEvent.emit = emitter.emit
    promiEvent.on = emitter.on
    promiEvent.once = emitter.once
    promiEvent.off = emitter.off
    promiEvent.listeners = emitter.listeners
    promiEvent.addListener = emitter.addListener
    promiEvent.removeListener = emitter.removeListener
    promiEvent.removeAllListeners = emitter.removeAllListeners

    return promiEvent
}

describe('smartContract utils', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
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

    describe('getPrefixedHexString', () => {
        it('prefixes unprefixed hex string', () => {
            assert.equal(all.getPrefixedHexString('1234'), '0x1234')
        })
        it('keeps prefixed string as is', () => {
            assert.equal(all.getPrefixedHexString('0x1234'), '0x1234')
        })
    })

    describe('getUnprefixedHexString', () => {
        it('deprefixes prefixed hex string', () => {
            assert.equal(all.getUnprefixedHexString('0x1234'), '1234')
        })
        it('keeps unprefixed string as is', () => {
            assert.equal(all.getUnprefixedHexString('1234'), '1234')
        })
    })

    describe('isValidHexString', () => {
        it('detects a valid hex string ', () => {
            assert.equal(all.isValidHexString('12345'), true)
            assert.equal(all.isValidHexString('deadbeef'), true)
            assert.equal(all.isValidHexString('0x12345'), true)
            assert.equal(all.isValidHexString('0xcafebabe'), true)
        })

        it('detects an invalid hex string', () => {
            assert.equal(all.isValidHexString(undefined), false)
            assert.equal(all.isValidHexString(null), false)
            assert.equal(all.isValidHexString(3), false)
            assert.equal(all.isValidHexString('öööö'), false)
            assert.equal(all.isValidHexString('0xöööö'), false)
        })

        it('detects an invalid hex string with a zero-width space', () => {
            // IMPORTANT: The ids in the next lines contain zero-width spaces. Don't remove and retype without adding them there again
            assert.equal(all.isValidHexString('0x1234​'), false)
            assert.equal(all.isValidHexString('1234​'), false)
        })
    })

    describe('getContract', () => {
        it('must return the correct contract', async () => {
            const contractAddress = '0x123456789'
            const abi = [{}]

            class Test {}

            const contractSpy = sandbox.spy(Test)
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                eth: {
                    Contract: contractSpy,
                },
            }))
            const contract = all.getContract({
                address: contractAddress,
                abi,
            })
            assert(contract instanceof Test)
            assert(contractSpy.calledOnce)
            assert(contractSpy.calledWithNew())
            assert(contractSpy.calledWith(abi, contractAddress))
        })
    })

    describe('call', () => {
        it('must return the right thing', () => {
            const stub = sandbox.stub().callsFake(() => 'test')
            const method = {
                call: stub,
            }
            const callResult = all.call(method)
            assert.equal('test', callResult)
        })
    })

    describe('send', () => {
        let accountStub
        let networkStub

        beforeEach(() => {
            accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            networkStub = sandbox.stub().callsFake(() => Promise.resolve(1))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
                getEthereumNetwork: networkStub,
            }))
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                networkId: 1,
            }))
        })

        afterEach(() => {
            accountStub = undefined
        })

        it('must return a Transaction', () => {
            const fakeEmitter = PromiEvent()
            const method = {
                send: () => fakeEmitter,
                estimateGas: () => Promise.resolve(0),
            }
            assert(all.send(method) instanceof Transaction)
        })

        it('must ask for the default address and send the transaction with it', (done) => {
            const fakeEmitter = PromiEvent()
            all.send({
                send: ({ from }) => {
                    done(assert.equal('testAccount', from))
                    return fakeEmitter
                },
                estimateGas: () => Promise.resolve(0),
            })
        })

        it('must fail if checkEthereumNetworkIsCorrect fails', (done) => {
            networkStub = sandbox.stub().callsFake(() => Promise.resolve(2))
            const fakeEmitter = {
                on: () => fakeEmitter,
                off: () => fakeEmitter,
            }
            all.send({
                send: () => fakeEmitter,
                estimateGas: () => Promise.resolve(0),
            })
                .onError((e) => {
                    assert.equal('incorrectEthereumNetwork', e.message)
                    done()
                })
        })

        describe('error', () => {
            it('must bind errorHandler before receipt', (done) => {
                const promiEvent = PromiEvent()

                const method = {
                    send: () => promiEvent,
                    estimateGas: () => {},
                }

                all.send(method)
                    .onError((e) => {
                        assert.equal('test', e)
                        done()
                    })

                setTimeout(() => {
                    promiEvent.emit('error', 'test')
                })
            })
            it('must bind new errorHandler after receipt', (done) => {
                const receipt = 'receipt'
                const promiEvent = PromiEvent()
                const error = new Error('test')
                const hash = '0x000'
                const method = {
                    send: () => promiEvent,
                    estimateGas: () => {},
                }
                all.send(method)
                    .onError((e) => {
                        assert(e instanceof TransactionError)
                        assert.equal('test', e.message)
                        assert.equal(receipt, e.getReceipt())
                        done()
                    })

                setTimeout(() => {
                    promiEvent.emit('transactionHash', hash)
                    promiEvent.emit('error', error, receipt)
                })
            })
        })

        describe('transactionHash', () => {
            it('must work correctly', (done) => {
                const emitter = PromiEvent()
                const method = {
                    send: () => emitter,
                    estimateGas: () => {},
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
                const emitter = PromiEvent()
                const receipt = {
                    status: '0x1',
                    test: 'test',
                }
                const method = {
                    send: () => emitter,
                    estimateGas: () => {},
                }
                all.send(method)
                    .onTransactionComplete((receipt2) => {
                        assert.equal(receipt.test, receipt2.test)
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                })
            })
            it('must emit error if receipt.status === 0', (done) => {
                const emitter = PromiEvent()
                const receipt = {
                    status: '0x0',
                    test: 'test',
                }
                const method = {
                    send: () => emitter,
                    estimateGas: () => {},
                }
                all.send(method)
                    .onTransactionComplete(() => {
                        assert(false)
                    })
                    .onError((e) => {
                        assert(e instanceof TransactionError)
                        assert.equal('txFailed', e.message)
                        assert.equal(receipt, e.getReceipt())
                        done()
                    })

                setTimeout(() => {
                    emitter.emit('receipt', receipt)
                })
            })
        })

        describe('gasLimit', () => {
            it('it must use the value given in options', (done) => {
                const emitter = PromiEvent()
                const method = {
                    send: (options) => {
                        assert.equal(options.gas, 123321)
                        done()
                        return emitter
                    },
                }
                all.send(method, {
                    gas: 123321,
                })
            })
            it('it must use the default gas limit if none is given', (done) => {
                const emitter = PromiEvent()
                const method = {
                    send: (options) => {
                        assert.equal(options.gas, 300000)
                        done()
                        return emitter
                    },
                }
                all.send(method)
            })
        })

        describe('isUpdateContractProductRequired', () => {
            const contractProduct = {
                id: 'product-1',
                pricePerSecond: 1000,
                beneficiaryAddress: 'test1',
                priceCurrency: 'DATA',
            }
            const editProduct = {
                id: 'product-1',
                name: 'Product 1',
                description: 'Description',
                pricePerSecond: 1000,
                beneficiaryAddress: 'test1',
                priceCurrency: 'DATA',
            }
            it('it must return true if product is paid and beneficiaryAddress has been changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    beneficiaryAddress: 'test2',
                }
                assert.equal(all.isUpdateContractProductRequired(contractProduct, editProductUpdated), true)
            })
            it('it must return true if product is paid and pricePerSecond has been changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    pricePerSecond: 2000,
                }
                assert.equal(all.isUpdateContractProductRequired(contractProduct, editProductUpdated), true)
            })
            it('it must return true if product is paid and currency has been changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    priceCurrency: 'USD',
                }
                assert.equal(all.isUpdateContractProductRequired(contractProduct, editProductUpdated), true)
            })
        })
    })
})
