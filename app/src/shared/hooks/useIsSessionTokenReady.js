import { useSelector } from 'react-redux'
import { useSession } from '$shared/components/SessionProvider'
import { selectAuthState } from '$shared/modules/user/selectors'

export default function useIsSessionTokenReady() {
    const { token } = useSession()
    const { isAuthenticating, authenticationFailed, isAuthenticated } = useSelector(selectAuthState)

    return !!token || (!isAuthenticating && (!!authenticationFailed || !isAuthenticated))
}
