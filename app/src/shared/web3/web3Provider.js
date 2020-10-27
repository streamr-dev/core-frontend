// @flow

import Web3 from 'web3'

import getConfig from '$shared/web3/config'
import type { Address } from '$shared/flowtype/web3-types'
import {
    Web3NotSupportedError,
    Web3NotEnabledError,
    WalletLockedError,
} from '$shared/errors/Web3/index'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import FakeProvider from 'web3-fake-provider'

declare var ethereum: Web3
declare var web3: Web3

// Disable automatic reload when network is changed in Metamask,
// reload is handled in GlobalInfoWatcher component
if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

type StreamrWeb3Options = {
    isLegacy?: boolean,
}

export class StreamrWeb3 extends Web3 {
    isLegacy: boolean

    constructor(provider: any, options: StreamrWeb3Options = {}) {
        super(provider)
        this.isLegacy = options && !!options.isLegacy
        // Set number of desired confirmations for transactions.
        // This needs to be 1 for local Ganache chain. Default is 24.
        this.transactionConfirmationBlocks = getConfig().transactionConfirmationBlocks
    }

    getDefaultAccount = (): Promise<Address> => this.eth.getAccounts()
        .then((accounts) => {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                throw new WalletLockedError('MetaMask browser extension is locked')
            }
            return accounts[0]
        })

    getEthereumNetwork = (): Promise<number> => this.eth.net.getId()

    isEnabled = (): boolean => !!this.currentProvider
}

const publicWeb3Options = {
    timeout: 20000, // milliseconds,
}

export const getPublicWeb3 = (): StreamrWeb3 =>
    new StreamrWeb3(new Web3.providers.HttpProvider(getConfig().publicNodeAddress, publicWeb3Options))

export const getWebSocketWeb3 = (): StreamrWeb3 =>
    new StreamrWeb3(new Web3.providers.WebsocketProvider(getConfig().websocketAddress))

export const getWeb3 = (): StreamrWeb3 => {
    if (typeof ethereum !== 'undefined') {
        return new StreamrWeb3(ethereum)
    } else if (typeof web3 !== 'undefined') {
        return new StreamrWeb3(web3.currentProvider, {
            isLegacy: true,
        })
    }
    return new StreamrWeb3(new FakeProvider(), {
        isLegacy: true,
    })
}

type ValidateParams = {
    web3: Web3,
    checkNetwork?: boolean,
}

export const validateWeb3 = async ({ web3: _web3, checkNetwork = true }: ValidateParams): Web3 => {
    if ((_web3.isLegacy && !window.web3) ||
        (!_web3.isLegacy && !window.ethereum)) {
        throw new Web3NotSupportedError()
    }

    // enable metamask
    if (!_web3.isLegacy) {
        try {
            await ethereum.enable()
        } catch (e) {
            console.warn(e)
            throw new Web3NotEnabledError()
        }
    }

    if (!_web3.currentProvider) {
        throw new Web3NotEnabledError()
    }

    try {
        // Check accounts
        const accounts = await _web3.eth.getAccounts()

        if (!Array.isArray(accounts) || accounts.length === 0) {
            throw new WalletLockedError()
        }
    } catch (e) {
        console.warn(e)
        throw new WalletLockedError()
    }

    // Validate correct network
    if (checkNetwork) {
        await checkEthereumNetworkIsCorrect(_web3)
    }

    return _web3
}

export default getWeb3
