// @flow

import Web3 from 'web3'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { networks } from '$shared/utils/constants'
import unlock from '$utils/web3/unlock'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

type ValidateParams = {
    requireNetwork?: number | boolean,
    unlockTimeout?: number | boolean,
}

export default async function validateWeb3({ requireNetwork = networks.MAINNET, unlockTimeout = false }: ValidateParams): Web3 {
    await unlock({
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
    await getDefaultWeb3Account()

    if (typeof requireNetwork !== 'number') {
        return
    }

    await checkEthereumNetworkIsCorrect({
        network: requireNetwork,
    })
}
