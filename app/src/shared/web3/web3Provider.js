// @flow

import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'
import getConfig from '$shared/web3/config'
import Web3NotSupportedError from '$shared/errors/Web3NotSupportedError'
import Web3NotEnabledError from '$shared/errors/Web3NotEnabledError'
import WalletLockedError from '$shared/errors/WalletLockedError'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { networks } from '$shared/utils/constants'
import enableMetamask from '$utils/web3/enableMetamask'

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
    metamaskProvider: any

    constructor(provider: any, options: StreamrWeb3Options = {}) {
        super(provider)
        this.metamaskProvider = provider
        this.isLegacy = options && !!options.isLegacy
        // Set number of desired confirmations for transactions.
        // This needs to be 1 for local Ganache chain. Default is 24.
        const { mainnet } = getConfig()
        this.transactionConfirmationBlocks = mainnet.transactionConfirmationBlocks
    }
}

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
    requireNetwork?: $Values<typeof networks> | boolean,
    unlockTimeout?: number | boolean,
}

export const validateWeb3 = async ({ web3: _web3, requireNetwork = networks.MAINNET, unlockTimeout = false }: ValidateParams): Web3 => {
    if ((_web3.isLegacy && !window.web3) ||
        (!_web3.isLegacy && !window.ethereum)) {
        throw new Web3NotSupportedError()
    }

    // enable metamask
    if (!_web3.isLegacy) {
        await enableMetamask(ethereum, {
            timeoutAfter: (() => {
                if (unlockTimeout === false) {
                    return undefined
                }

                if (typeof unlockTimeout === 'number') {
                    return unlockTimeout
                }

                return 100
            })(),
        })
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
    if (typeof requireNetwork === 'string' && Object.values(networks).includes(requireNetwork)) {
        await checkEthereumNetworkIsCorrect({
            web3: _web3,
            network: requireNetwork,
        })
    }

    return _web3
}

export default getWeb3
