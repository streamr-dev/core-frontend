import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { post } from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import { logout as logoutAction } from '$shared/modules/user/actions'
import useFailure from '$shared/hooks/useFailure'
import { setupSession } from '$shared/reducers/session'
import routes from '$routes'

const LogoutPage = () => {
    const isMounted = useIsMounted()

    const fail = useFailure()

    const dispatch = useDispatch()

    const history = useHistory()

    useOnMount(async () => {
        try {
            await post({
                url: routes.auth.external.logout(),
            })
            if (isMounted()) {
                dispatch(logoutAction())
                dispatch(setupSession([]))
                history.push(routes.root())
            }
        } catch (e) {
            fail(e)
        }
    })

    return null
}

export default LogoutPage
