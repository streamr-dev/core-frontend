import TimeoutError from '$shared/errors/TimeoutError'
import WalletLockedError from '$shared/errors/WalletLockedError'
import Web3NotEnabledError from '$shared/errors/Web3NotEnabledError'
import getWeb3 from '$utils/web3/getWeb3'

export default async function unlock({ timeoutAfter = Number.POSITIVE_INFINITY } = {}) {
    const { currentProvider } = getWeb3()

    if (!currentProvider) {
        throw new Web3NotEnabledError()
    }

    const promise = typeof currentProvider.request === 'function' ? (
        // `request(…)` is available since MetaMask v8.
        currentProvider.request({
            method: 'eth_requestAccounts',
        })
    ) : (
        // Fallback to `enable()`.
        currentProvider.enable()
    )

    try {
        await Promise.race([
            promise,
            new Promise((_, reject) => {
                if (timeoutAfter === Number.POSITIVE_INFINITY) {
                    return
                }

                setTimeout(() => void reject(new TimeoutError()), timeoutAfter)
            }),
        ])
    } catch (e) {
        throw new WalletLockedError()
    }
}
