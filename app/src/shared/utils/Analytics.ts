/**
 * Configure analytics data from app state.
 */
import * as Sentry from '@sentry/browser'
import { useWalletAccount } from '../stores/wallet'

function Analytics(): null {
    const account = useWalletAccount()

    if (account) {
        Sentry.configureScope((scope) => {
            scope.setUser({ id: account })
        })
    }

    return null
}

export default Analytics
