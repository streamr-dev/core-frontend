// @flow

import Web3 from 'web3'
import Web3NotSupportedError from '$shared/errors/Web3NotSupportedError'
import Web3NotEnabledError from '$shared/errors/Web3NotEnabledError'
import WalletLockedError from '$shared/errors/WalletLockedError'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { networks } from '$shared/utils/constants'
import enableMetamask from '$utils/web3/enableMetamask'

declare var ethereum: Web3
declare var web3: Web3

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
