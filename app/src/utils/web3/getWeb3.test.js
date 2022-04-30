import Web3 from 'web3'
// import getWeb3 from './getWeb3'

describe.skip('getWeb3', () => {
    beforeEach(() => {
        global.web3 = undefined
        global.ethereum = undefined
    })

    it('must return the web3 object with the window.web3.currentProvider provider if it is available/defined', () => {
        // 'legacy' metamask web3 injection scenario
        global.web3 = Web3
        global.web3.currentProvider = new Web3.providers.HttpProvider('http://boop:1337')
        // const web3 = getWeb3()
        // expect(web3.currentProvider.host).toBe('http://boop:1337')
    })

    it('must return the web3 object with the window.ethereum provider if it is available/defined', () => {
        // permissioned metamask provider injection scenario
        global.ethereum = new Web3.providers.HttpProvider('http://vitalik:300')
        // const web3 = getWeb3()
        // expect(web3.currentProvider.host).toBe('http://vitalik:300')
    })
})
