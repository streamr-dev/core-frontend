import Web3 from 'web3'
import { getWeb3, StreamrWeb3 } from '$shared/web3/web3Provider'

describe('web3Provider', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('StreamrWeb3', () => {
        it('must extend Web3', () => {
            expect(StreamrWeb3.prototype).toBeInstanceOf(Web3)
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
})
