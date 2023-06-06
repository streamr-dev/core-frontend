import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import { networks } from '$shared/utils/constants'
import unlock from '$utils/web3/unlock'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
type ValidateParams = {
    requireNetwork?: number | boolean
    unlockTimeout?: number | boolean
}
export default async function validateWeb3({
    requireNetwork = 1,
    unlockTimeout = false,
}: ValidateParams): Promise<void> {
    await unlock({
        timeoutAfter: (() => {
            if (unlockTimeout === false) {
                return undefined
            }

            if (typeof unlockTimeout === 'number') {
                return unlockTimeout
            }

            return 200
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
