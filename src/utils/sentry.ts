import { withScope } from '@sentry/react'
import { useEffect } from 'react'
import { useWalletAccount } from '~/shared/stores/wallet'

export function useSetSentryScopeEffect() {
    const account = useWalletAccount()

    useEffect(
        function setSentryScopeUser() {
            withScope((scope) => {
                scope.setUser({ id: account })
            })
        },
        [account],
    )
}
