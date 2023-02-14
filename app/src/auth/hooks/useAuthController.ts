import {useContext} from "react"
import {AuthenticationController, AuthenticationControllerContext} from "$auth/authenticationController"

export const useAuthController = (): AuthenticationController => {
    return useContext(AuthenticationControllerContext)
}
