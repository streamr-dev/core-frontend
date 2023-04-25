import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectBalances } from '$shared/modules/user/selectors'
import { updateBalances } from '$shared/modules/user/actions'
import { useWalletAccount } from '$shared/stores/wallet'

export function useBalances() {
    const account = useWalletAccount()

    const dispatch = useDispatch()
    // Balances are stored in redux state and polled regularly in GlobalInfoWatcher component.
    const balances = useSelector(selectBalances)
    // Fetches & updates account balances to redux state
    const update = useCallback(() => {
        if (account) {
            dispatch(updateBalances(account))
        }
    }, [dispatch, account])
    return useMemo(
        () => ({
            update,
            balances,
        }),
        [update, balances],
    )
}
