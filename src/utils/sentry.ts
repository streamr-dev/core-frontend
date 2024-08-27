import { getGlobalScope } from '@sentry/react'
import { useEffect } from 'react'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useCurrentChainId } from '~/utils/chains'

export function useSetSentryScopeEffect() {
    const account = useWalletAccount()

    const chainId = useCurrentChainId()

    useEffect(
        function setSentryScopeUser() {
            getGlobalScope().setUser({ id: account })
        },
        [account],
    )

    useEffect(
        function setSentryScopeChainId() {
            getGlobalScope().setExtra('chainId', chainId)
        },
        [chainId],
    )
}
