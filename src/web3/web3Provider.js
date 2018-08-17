// @flow

import Web3 from 'web3'

import getConfig from '../web3/config'
import type { Address, Web3Provider } from '../flowtype/web3-types'

declare var ethereum: Web3

export class StreamrWeb3 extends Web3 {
    getDefaultAccount = (): Promise<Address> => this.eth.getAccounts()
        .then((accounts) => {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                throw new Error('MetaMask browser extension is locked')
            }
            return accounts[0]
        })

    getEthereumNetwork = (): Promise<number> => this.eth.net.getId()

    isEnabled = (): boolean => !!this.currentProvider
}

const sharedWeb3s: {
    [any]: StreamrWeb3
} = {}

export const getWeb3ByProvider = (provider: ?Web3Provider) => {
    console.log('provider is: ', provider)
    const serializedProvider = (provider && (
        provider.host || // HttpProvider
        (provider.connection && provider.connection.url) || // WebsocketProvider
        provider.path || // IpcProvider
        (provider.constructor && provider.constructor.name) // Any other provider
    )) || JSON.stringify(provider) // Undefined
    if (!sharedWeb3s[serializedProvider]) {
        sharedWeb3s[serializedProvider] = new StreamrWeb3(provider)
    }
    console.log(sharedWeb3s)
    return sharedWeb3s[serializedProvider]
}

export const getPublicWeb3 = (): StreamrWeb3 => getWeb3ByProvider(new Web3.providers.HttpProvider(getConfig().publicNodeAddress))

export const getWeb3 = (): StreamrWeb3 => {
    if (typeof ethereum !== 'undefined' && ethereum) {
        return getWeb3ByProvider(ethereum)
    }
    return getWeb3ByProvider(new Web3.providers.HttpProvider(getConfig().publicNodeAddress))
}

// export const getWeb3 = (): StreamrWeb3 => getWeb3ByProvider(typeof ethereum !== 'undefined' && ethereum)

export default getWeb3
