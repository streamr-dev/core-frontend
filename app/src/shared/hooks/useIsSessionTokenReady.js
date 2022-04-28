import { useSelector } from 'react-redux'
import { useSessionToken } from '$shared/reducers/session'
import { selectAuthState } from '$shared/modules/user/selectors'

export default function useIsSessionTokenReady() {
    const token = useSessionToken()
    const { isAuthenticating, authenticationFailed, isAuthenticated } = useSelector(selectAuthState)

    return !!token || (!isAuthenticating && (!!authenticationFailed || !isAuthenticated))
}
