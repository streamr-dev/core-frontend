// @flow

import Web3 from 'web3'
import getConfig from '../web3/config'
import type { Address, Web3Provider } from '../flowtype/web3-types'

declare var web3: Web3

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
    [string]: StreamrWeb3
} = {}

export const getWeb3ByProvider = (provider: Web3Provider) => {
    let serializedProvider
    if (provider.isMetaMask) {
        serializedProvider = 'MetaMask'
    } else if (provider instanceof StreamrWeb3.providers.HTTPProvider) {
        serializedProvider = provider.host
    } else if (provider instanceof StreamrWeb3.providers.WebsocketProvider) {
        serializedProvider = provider.connection.url
    } else if (provider instanceof StreamrWeb3.providers.IpcProvider) {
        serializedProvider = provider.path
    } else {
        throw new Error('Unknown provider')
    }
    if (!sharedWeb3s[serializedProvider]) {
        sharedWeb3s[serializedProvider] = new StreamrWeb3(provider)
    }
    return sharedWeb3s[serializedProvider]
}

export const getWeb3 = () => getWeb3ByProvider(typeof web3 !== 'undefined' && web3.currentProvider)

export const getPublicWeb3 = () => getWeb3ByProvider(new Web3.providers.HttpProvider(getConfig().publicNodeAddress))

export default getWeb3
