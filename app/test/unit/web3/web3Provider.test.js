import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'

import { getWeb3, getPublicWeb3, StreamrWeb3 } from '$shared/web3/web3Provider'

describe('web3Provider', () => {
    let oldEnv
    beforeEach(() => {
        oldEnv = {
            ...process.env,
        }
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        process.env = {
            ...oldEnv,
        }
    })
    describe('StreamrWeb3', () => {
        it('must extend Web3', () => {
            expect(StreamrWeb3.prototype).toBeInstanceOf(Web3)
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
                const getAccSpy = jest.fn(() => Promise.resolve(['testAccount']))
                jest.spyOn(web3.eth, 'getAccounts').mockImplementation(getAccSpy)
                const acc = await web3.getDefaultAccount()
                expect(acc).toBe('testAccount')
                expect(getAccSpy).toHaveBeenCalledTimes(1)
            })
            it('must throw error if getAccounts gives undefined/null', async (done) => {
                try {
                    const anotherWeb3 = new StreamrWeb3(new FakeProvider())
                    await anotherWeb3.getDefaultAccount()
                } catch (e) {
                    expect(e.message).toMatch('is locked')
                    done()
                }
            })
            it('must throw error if getAccounts gives empty list', async (done) => {
                jest.spyOn(web3.eth, 'getAccounts').mockImplementation(jest.fn(() => Promise.resolve([])))
                try {
                    await web3.getDefaultAccount()
                } catch (e) {
                    expect(e.message).toMatch('is locked')
                    done()
                }
            })
        })

        describe('getEthereumNetwork', () => {
            it('must return the network', async () => {
                const web3 = new StreamrWeb3()
                const getNetStub = jest.fn(() => Promise.resolve(6))
                jest.spyOn(web3.eth.net, 'getId').mockImplementation(getNetStub)
                const net = await web3.getEthereumNetwork()
                expect(net).toBe(6)
                expect(getNetStub).toHaveBeenCalledTimes(1)
            })
        })

        describe('isEnabled', () => {
            it('must return correct value', () => {
                const web3 = new StreamrWeb3()
                expect(web3.isEnabled()).toBe(false)
                const anotherWeb3 = new StreamrWeb3(new FakeProvider())
                expect(anotherWeb3.isEnabled()).toBe(true)
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
            expect(web3.currentProvider.host).toBe('http://boop:1337')
        })
        it('must return the web3 object with the window.ethereum provider if it is available/defined', () => {
            // permissioned metamask provider injection scenario
            global.ethereum = new StreamrWeb3.providers.HttpProvider('http://vitalik:300')
            const web3 = getWeb3()
            expect(web3.currentProvider.host).toBe('http://vitalik:300')
        })
    })
    describe('getPublicWeb3', () => {
        it('must return web3 with the public provider', () => {
            process.env.WEB3_PUBLIC_HTTP_PROVIDER = 'http://localhost:8545'
            const web3 = getPublicWeb3()
            expect(web3.currentProvider.host).toBe('http://localhost:8545')
        })
    })
})
