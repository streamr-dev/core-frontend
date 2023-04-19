import { useContext } from 'react'
import { AuthenticationControllerContext } from '$auth/authenticationController'

export function useAuthController() {
    return useContext(AuthenticationControllerContext)
}
