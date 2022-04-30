import TimeoutError from '$shared/errors/TimeoutError'
import WalletLockedError from '$shared/errors/WalletLockedError'
import Web3NotEnabledError from '$shared/errors/Web3NotEnabledError'

export default async function unlock(provider, { timeoutAfter = Number.POSITIVE_INFINITY } = {}) {
    if (!provider) {
        throw new Web3NotEnabledError()
    }

    const promise = typeof provider.request === 'function' ? (
        // `request(…)` is available since MetaMask v8.
        provider.request({
            method: 'eth_requestAccounts',
        })
    ) : (
        // Fallback to `enable()`.
        provider.enable()
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
