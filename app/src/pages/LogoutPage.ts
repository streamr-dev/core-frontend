import {FunctionComponent, useContext} from "react"
import { useHistory } from 'react-router-dom'
import useIsMounted from '$shared/hooks/useIsMounted'
import {AuthenticationControllerContext} from "$auth/authenticationController"
import useOnMount from '$shared/hooks/useOnMount'
import routes from '$routes'

const LogoutPage: FunctionComponent = () => {
    const isMounted = useIsMounted()
    const history = useHistory()
    const {removeAuthSession} = useContext(AuthenticationControllerContext)
    useOnMount(async () => {
        if (isMounted()) {
            removeAuthSession()
            history.push(routes.root())
        }
    })
    return null
}

export default LogoutPage
