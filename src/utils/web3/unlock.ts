import TimeoutError from '~/shared/errors/TimeoutError'
import WalletLockedError from '~/shared/errors/WalletLockedError'
import Web3NotEnabledError from '~/shared/errors/Web3NotEnabledError'
import getWeb3 from '~/utils/web3/getWeb3'
export default async function unlock({
    timeoutAfter = Number.POSITIVE_INFINITY,
} = {}): Promise<void> {
    const { currentProvider } = getWeb3()

    if (!currentProvider) {
        throw new Web3NotEnabledError()
    }

    if (typeof currentProvider === 'string') {
        throw new Web3NotEnabledError()
    }

    const provider = currentProvider as any

    const promise =
        typeof provider.request === 'function' // `request(…)` is available since MetaMask v8.
            ? provider.request({
                  method: 'eth_requestAccounts',
              }) // Fallback to `enable()`.
            : provider.enable()

    try {
        await Promise.race([
            promise,
            new Promise((resolve, reject) => {
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
