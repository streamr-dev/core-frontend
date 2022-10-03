import EventEmitter from 'events'

import * as getConfig from '$shared/web3/config'
import * as all from '$mp/utils/smartContract'
import Transaction from '$shared/utils/Transaction'
import TransactionError from '$shared/errors/TransactionError'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import getChainId from '$utils/web3/getChainId'
import getWeb3 from '$utils/web3/getWeb3'

jest.mock('$utils/web3/getDefaultWeb3Account', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

jest.mock('$utils/web3/getChainId', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockChainId(chainId) {
    getChainId.mockImplementation(() => Promise.resolve(chainId))
}

jest.mock('$utils/web3/getWeb3', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

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
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        getDefaultWeb3Account.mockReset()
        getChainId.mockReset()
    })

    describe('hexEqualsZero', () => {
        it('must return true when 0 with 0x prefix', () => {
            expect(all.hexEqualsZero('0x0000000000000000000000000000000')).toBe(true)
        })
        it('must return true when 0 without 0x prefix', () => {
            expect(all.hexEqualsZero('000000000000000000000000000000000')).toBe(true)
        })
        it('must return false when other than 0 with 0x prefix', () => {
            expect(!all.hexEqualsZero('0x3123123123123123123123123123123123')).toBe(true)
            expect(!all.hexEqualsZero('0x0000000000000000000000000000000002')).toBe(true)
        })
        it('must return false when other than 0 without 0x prefix', () => {
            expect(!all.hexEqualsZero('3123123123123123123123123123123123')).toBe(true)
            expect(!all.hexEqualsZero('0000000000000000000000000000000002')).toBe(true)
        })
        it('must return false with invalid strings', () => {
            expect(!all.hexEqualsZero('0x')).toBe(true)
            expect(!all.hexEqualsZero('')).toBe(true)
            expect(!all.hexEqualsZero(undefined)).toBe(true)
            expect(!all.hexEqualsZero(null)).toBe(true)
            expect(!all.hexEqualsZero(8)).toBe(true)
        })
    })

    describe('getPrefixedHexString', () => {
        it('prefixes unprefixed hex string', () => {
            expect(all.getPrefixedHexString('1234')).toBe('0x1234')
        })
        it('keeps prefixed string as is', () => {
            expect(all.getPrefixedHexString('0x1234')).toBe('0x1234')
        })
    })

    describe('getUnprefixedHexString', () => {
        it('deprefixes prefixed hex string', () => {
            expect(all.getUnprefixedHexString('0x1234')).toBe('1234')
        })
        it('keeps unprefixed string as is', () => {
            expect(all.getUnprefixedHexString('1234')).toBe('1234')
        })
    })

    describe('isValidHexString', () => {
        it('detects a valid hex string ', () => {
            expect(all.isValidHexString('12345')).toBe(true)
            expect(all.isValidHexString('deadbeef')).toBe(true)
            expect(all.isValidHexString('0x12345')).toBe(true)
            expect(all.isValidHexString('0xcafebabe')).toBe(true)
        })

        it('detects an invalid hex string', () => {
            expect(all.isValidHexString(undefined)).toBe(false)
            expect(all.isValidHexString(null)).toBe(false)
            expect(all.isValidHexString(3)).toBe(false)
            expect(all.isValidHexString('öööö')).toBe(false)
            expect(all.isValidHexString('0xöööö')).toBe(false)
        })

        it('detects an invalid hex string with a zero-width space', () => {
            // IMPORTANT: The ids in the next lines contain zero-width spaces. Don't remove and retype without adding them there again
            expect(all.isValidHexString('0x1234​')).toBe(false)
            expect(all.isValidHexString('1234​')).toBe(false)
        })
    })

    describe('getContract', () => {
        it('must return the correct contract', async () => {
            const contractAddress = '0x123456789'
            const abi = [{}]

            class Test {}

            getWeb3.mockImplementation(() => ({
                eth: {
                    Contract: Test,
                },
            }))
            const contract = all.getContract({
                address: contractAddress,
                abi,
            })
            expect(contract).toBeInstanceOf(Test)
        })
    })

    describe('call', () => {
        it('must return the right thing', () => {
            const stub = jest.fn(() => 'test')
            const method = {
                call: stub,
            }
            const callResult = all.call(method)
            expect('test').toBe(callResult)
        })
    })

    describe('send', () => {
        beforeEach(() => {
            getDefaultWeb3Account.mockImplementation(() => Promise.resolve('testAccount'))

            mockChainId('1')

            jest.spyOn(getConfig, 'default').mockImplementation(() => ({
                mainnet: {
                    chainId: '1',
                },
                dataunionsChain: {
                    chainId: '8995',
                },
            }))
        })

        it('must return a Transaction', () => {
            const fakeEmitter = PromiEvent()
            const method = {
                send: () => fakeEmitter,
                estimateGas: () => Promise.resolve(0),
            }
            expect(all.send(method, {
                network: 1,
            })).toBeInstanceOf(Transaction)
        })

        it('must ask for the default address and send the transaction with it', (done) => {
            const fakeEmitter = PromiEvent()
            all.send({
                send: ({ from }) => {
                    done(expect(from).toBe('testAccount'))
                    return fakeEmitter
                },
                estimateGas: () => Promise.resolve(0),
            }, {
                network: 1,
            })
        })

        it('must fail if checkEthereumNetworkIsCorrect fails in mainnet', (done) => {
            mockChainId('2')

            const fakeEmitter = {
                on: () => fakeEmitter,
                off: () => fakeEmitter,
            }
            all.send({
                send: () => fakeEmitter,
                estimateGas: () => Promise.resolve(0),
            }, {
                network: 1337,
            })
                .onError((e) => {
                    expect(e.requiredNetwork).toBe(1337)
                    expect(e.currentNetwork).toBe('2')
                    done()
                })
        })

        it('must fail if checkEthereumNetworkIsCorrect fails in mainnet', (done) => {
            mockChainId('2')

            const fakeEmitter = {
                on: () => fakeEmitter,
                off: () => fakeEmitter,
            }
            all.send({
                send: () => fakeEmitter,
                estimateGas: () => Promise.resolve(0),
            }, {
                network: 1337,
            })
                .onError((e) => {
                    expect(e.requiredNetwork).toBe(1337)
                    expect(e.currentNetwork).toBe('2')
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

                all.send(method, {
                    network: 1,
                })
                    .onError((e) => {
                        expect(e).toBe('test')
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
                all.send(method, {
                    network: 1,
                })
                    .onError((e) => {
                        expect(e).toBeInstanceOf(TransactionError)
                        expect(e.message).toBe('test')
                        expect(e.getReceipt()).toBe(receipt)
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
                all.send(method, {
                    network: 1,
                })
                    .onTransactionHash((hash) => {
                        expect(hash).toBe('test')
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
                all.send(method, {
                    network: 1,
                })
                    .onTransactionComplete((receipt2) => {
                        expect(receipt2.test).toBe(receipt.test)
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
                all.send(method, {
                    network: 1,
                })
                    .onTransactionComplete(() => {
                        expect(false).toBe(true)
                    })
                    .onError((e) => {
                        expect(e).toBeInstanceOf(TransactionError)
                        expect(e.message).toBe('Transaction failed')
                        expect(e.getReceipt()).toBe(receipt)
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
                        expect(options.gas).toBe(123321)
                        done()
                        return emitter
                    },
                }
                all.send(method, {
                    gas: 123321,
                    network: 1,
                })
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
                expect(all.isUpdateContractProductRequired(contractProduct, editProductUpdated)).toBe(true)
            })
            it('it must return true if product is paid and pricePerSecond has been changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    pricePerSecond: 2000,
                }
                expect(all.isUpdateContractProductRequired(contractProduct, editProductUpdated)).toBe(true)
            })
            it('it must return true if product is paid and pricingTokenAddress changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    pricingTokenAddress: '0x1337',
                }
                expect(all.isUpdateContractProductRequired(contractProduct, editProductUpdated)).toBe(true)
            })
            it('it must return true if product is paid and requiresWhitelist changed', () => {
                const editProductUpdated = {
                    ...editProduct,
                    requiresWhitelist: true,
                }
                expect(all.isUpdateContractProductRequired(contractProduct, editProductUpdated)).toBe(true)
            })
        })
    })
})
