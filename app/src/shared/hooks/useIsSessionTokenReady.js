import { useSelector } from 'react-redux'
import { getToken } from '$shared/utils/sessionToken'
import { selectAuthState } from '$shared/modules/user/selectors'

export default function useIsSessionTokenReady() {
    const sessionToken = getToken()
    const { isAuthenticating, authenticationFailed } = useSelector(selectAuthState)

    return !!sessionToken || (!isAuthenticating && !!authenticationFailed)
}
