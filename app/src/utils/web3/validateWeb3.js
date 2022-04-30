// @flow

import Web3 from 'web3'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { networks } from '$shared/utils/constants'
import unlock from '$utils/web3/unlock'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

type ValidateParams = {
    web3: Web3,
    requireNetwork?: $Values<typeof networks> | boolean,
    unlockTimeout?: number | boolean,
}

export default async function validateWeb3({ web3: _web3, requireNetwork = networks.MAINNET, unlockTimeout = false }: ValidateParams): Web3 {
    await unlock(_web3.currentProvider, {
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

    // Check if we have access to the accounts. It'll explode with
    // `WalletLockedError` if we don't.
    await getDefaultWeb3Account(_web3)

    if (typeof requireNetwork !== 'string' || !Object.values(networks).includes(requireNetwork)) {
        return _web3
    }

    await checkEthereumNetworkIsCorrect({
        web3: _web3,
        network: requireNetwork,
    })

    return _web3
}
