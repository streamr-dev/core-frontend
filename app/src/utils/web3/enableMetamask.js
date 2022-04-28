import Web3NotEnabledError from '$shared/errors/Web3NotEnabledError'
import TimeoutError from '$shared/errors/TimeoutError'
import WalletLockedError from '$shared/errors/WalletLockedError'

export default async function enableMetamask(provider, { timeoutAfter = Number.POSITIVE_INFINITY } = {}) {
    if (typeof provider.request !== 'function') {
        try {
            // `ethereum.request` is available since MetaMask v8. Fallback to `ethereum.enable()`.
            await provider.enable()
        } catch (e) {
            throw new Web3NotEnabledError()
        }

        return
    }

    try {
        await Promise.race([
            provider.request({
                method: 'eth_requestAccounts',
            }),
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
