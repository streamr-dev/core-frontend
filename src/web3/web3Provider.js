// @flow

import Web3 from 'web3'

declare var web3: Web3

export class StreamrWeb3 extends Web3 {
    getDefaultAccount = (): Promise<string> => this.eth.getAccounts()
        .then((accounts) => {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                throw new Error('MetaMask browser extension is locked')
            }
            return accounts[0]
        })
    isEnabled = (): boolean => !!this.currentProvider
}

const sharedWeb3 = new StreamrWeb3(typeof web3 !== 'undefined' && web3.currentProvider)

export const getWeb3 = (): StreamrWeb3 => sharedWeb3

export default getWeb3
