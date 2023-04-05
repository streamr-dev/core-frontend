import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectBalances } from '$shared/modules/user/selectors'
import { updateBalances } from '$shared/modules/user/actions'
import { useAuthController } from '$auth/hooks/useAuthController'
export function useBalances() {
    const { currentAuthSession } = useAuthController()
    const dispatch = useDispatch()
    // Balances are stored in redux state and polled regularly in GlobalInfoWatcher component.
    const balances = useSelector(selectBalances)
    // Fetches & updates account balances to redux state
    const update = useCallback(() => {
        dispatch(updateBalances(currentAuthSession.address))
    }, [dispatch, currentAuthSession])
    return useMemo(
        () => ({
            update,
            balances,
        }),
        [update, balances],
    )
}
