import {useCallback, useContext, useMemo} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectBalances } from '$shared/modules/user/selectors'
import { updateBalances } from '$shared/modules/user/actions'
import {AuthenticationControllerContext} from "$auth/authenticationController"
export function useBalances() {
    const {currentAuthSession} = useContext(AuthenticationControllerContext)
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
