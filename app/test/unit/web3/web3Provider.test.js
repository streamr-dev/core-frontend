import assert from 'assert-diff'
import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'
import sinon from 'sinon'

import { getWeb3, getPublicWeb3, StreamrWeb3 } from '$shared/web3/web3Provider'

describe('web3Provider', () => {
    let sandbox
    let oldEnv
    beforeEach(() => {
        sandbox = sinon.createSandbox()
        oldEnv = {
            ...process.env,
        }
    })
    afterEach(() => {
        sandbox.restore()
        process.env = {
            ...oldEnv,
        }
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
                const getAccSpy = sandbox.stub().callsFake(() => Promise.resolve(['testAccount']))
                sandbox.stub(web3, 'eth').value({
                    getAccounts: getAccSpy,
                })
                const acc = await web3.getDefaultAccount()
                assert.equal(acc, 'testAccount')
                assert(getAccSpy.calledOnce)
            })
            it('must throw error if getAccounts gives undefined/null', async (done) => {
                try {
                    const anotherWeb3 = new StreamrWeb3(new FakeProvider())
                    await anotherWeb3.getDefaultAccount()
                } catch (e) {
                    assert(e.message.match('is locked'))
                    done()
                }
            })
            it('must throw error if getAccounts gives empty list', async (done) => {
                sandbox.stub(web3, 'eth').value({
                    getAccounts: sandbox.stub().callsFake(() => Promise.resolve([])),
                })
                try {
                    await web3.getDefaultAccount()
                } catch (e) {
                    assert(e.message.match('is locked'))
                    done()
                }
            })
        })

        describe('getEthereumNetwork', () => {
            it('must return the network', async () => {
                const web3 = new StreamrWeb3()
                const getNetStub = sandbox.stub().callsFake(() => Promise.resolve(6))
                sandbox.stub(web3, 'eth').value({
                    net: {
                        getId: getNetStub,
                    },
                })
                const net = await web3.getEthereumNetwork()
                assert.equal(net, 6)
                assert(getNetStub.calledOnce)
            })
        })

        describe('isEnabled', () => {
            it('must return correct value', () => {
                const web3 = new StreamrWeb3()
                assert(!web3.isEnabled())
                const anotherWeb3 = new StreamrWeb3(new FakeProvider())
                assert(anotherWeb3.isEnabled())
            })
        })
    })
    describe('getWeb3', () => {
        beforeEach(() => {
            global.web3 = undefined
            global.ethereum = undefined
        })
        it('must return the web3 object with the window.web3.currentProvider provider if it is available/defined', () => {
            // 'legacy' metamask web3 injection scenario
            global.web3 = Web3
            global.web3.currentProvider = new StreamrWeb3.providers.HttpProvider('http://boop:1337')
            const web3 = getWeb3()
            assert.equal(web3.currentProvider.host, 'http://boop:1337')
        })
        it('must return the web3 object with the window.ethereum provider if it is available/defined', () => {
            // permissioned metamask provider injection scenario
            global.ethereum = new StreamrWeb3.providers.HttpProvider('http://vitalik:300')
            const web3 = getWeb3()
            assert.equal(web3.currentProvider.host, 'http://vitalik:300')
        })
    })
    describe('getPublicWeb3', () => {
        it('must return web3 with the public provider', () => {
            process.env.WEB3_PUBLIC_HTTP_PROVIDER = 'http://localhost:8545'
            const web3 = getPublicWeb3()
            assert.equal(web3.currentProvider.host, 'http://localhost:8545')
        })
    })
})
