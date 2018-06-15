import assert from 'assert-diff'
import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'
import sinon from 'sinon'

import getWeb3, { getWeb3ByProvider, getPublicWeb3, StreamrWeb3 } from '../../../src/web3/web3Provider'
import * as getConfig from '../../../src/web3/config'

describe('web3Provider', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })
    describe('StreamrWeb3', () => {
        it('must extend Web3', () => {
            assert(StreamrWeb3.prototype instanceof Web3)
        })

        describe('getDefaultAccount', () => {
            let web3
            beforeEach(() => {
                web3 = new StreamrWeb3()
            })
            afterEach(() => {
                web3 = null
            })
            it('must resolve with getAccounts()[0]', async () => {
                web3.eth.getAccounts = () => new Promise((resolve) => resolve(['testAccount']))
                const acc = await web3.getDefaultAccount()
                assert.equal(acc, 'testAccount')
            })
            it('must throw error if getAccounts gives undefined/null', async (done) => {
                try {
                    web3.setProvider(new FakeProvider())
                    await web3.getDefaultAccount()
                } catch (e) {
                    assert(e.message.match('is locked'))
                    done()
                }
            })
            it('must throw error if getAccounts gives empty list', async (done) => {
                web3.eth.getAccounts = () => new Promise((resolve) => resolve([]))
                try {
                    web3.setProvider(new FakeProvider())
                    await web3.getDefaultAccount()
                } catch (e) {
                    assert(e.message.match('is locked'))
                    done()
                }
            })
        })

        describe('isEnabled', () => {
            it('must return correct value', () => {
                const web3 = new StreamrWeb3()
                assert(!web3.isEnabled())
                web3.setProvider(new FakeProvider())
                assert(web3.isEnabled())
            })
        })
    })
    describe('getWeb3ByProvider', () => {
        it('must return the same instance every time if called with the same provider', () => {
            assert(getWeb3ByProvider(new StreamrWeb3.providers.HttpProvider('http://localhost:8545'))
                === getWeb3ByProvider(new StreamrWeb3.providers.HttpProvider('http://localhost:8545')))
        })
        it('must not return the same instance if called with different providers', () => {
            const p1 = new FakeProvider()
            const p2 = new StreamrWeb3.providers.HttpProvider('http://localhost:8545')
            assert(getWeb3ByProvider(p1) !== getWeb3ByProvider(p2))
        })
    })
    describe('getWeb3', () => {
        afterEach(() => {
            global.web3 = undefined
        })
        it('must return web3 with the metamask provider', () => {
            global.web3 = {
                currentProvider: new StreamrWeb3.providers.HttpProvider('http://localhost:8545'),
            }
            assert(getWeb3() === getWeb3ByProvider(new StreamrWeb3.providers.HttpProvider('http://localhost:8545')))
        })
    })
    describe('getPublicWeb3', () => {
        it('must return web3 with the public provider', () => {
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                publicNodeAddress: 'publicNodeAddress',
            }))
            assert(getPublicWeb3() === getWeb3ByProvider(new StreamrWeb3.providers.HttpProvider('publicNodeAddress')))
        })
    })
})
