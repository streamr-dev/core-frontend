import Web3 from 'web3'

describe('Metamask.getEthereumProvider', () => {
    beforeEach(() => {
        global.web3 = undefined
        global.ethereum = undefined
        jest.resetModules()
    })

    it('returns the web3 object with the window.web3.currentProvider provider if it is available/defined', () => {
        // 'legacy' metamask web3 injection scenario
        global.web3 = Web3
        global.web3.currentProvider = new Web3.providers.HttpProvider('http://boop:1337')

        let provider

        jest.isolateModules(() => {
            // eslint-disable-next-line global-require
            provider = require('./Metamask').default.getEthereumProvider()
        })

        expect(provider.host).toBe('http://boop:1337')
    })

    it('returns the web3 object with the window.ethereum provider if it is available/defined', () => {
        // permissioned metamask provider injection scenario
        global.ethereum = new Web3.providers.HttpProvider('http://vitalik:300')

        let provider

        jest.isolateModules(() => {
            // eslint-disable-next-line global-require
            provider = require('./Metamask').default.getEthereumProvider()
        })

        expect(provider.host).toBe('http://vitalik:300')
    })
})
