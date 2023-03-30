import { useContext } from 'react'
import { AuthenticationControllerContext } from '$auth/authenticationController'

export const useIsAuthenticated = (): boolean => {
    const { currentAuthSession } = useContext(AuthenticationControllerContext)
    return !!currentAuthSession.address
}
