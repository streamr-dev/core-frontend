import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import useFailure from '$shared/hooks/useFailure'
import { teardownSession } from '$shared/reducers/session'
import routes from '$routes'

const LogoutPage = () => {
    const isMounted = useIsMounted()

    const fail = useFailure()

    const dispatch = useDispatch()

    const history = useHistory()

    useOnMount(async () => {
        try {
            await dispatch(teardownSession())

            if (isMounted()) {
                history.push(routes.root())
            }
        } catch (e) {
            fail(e)
        }
    })

    return null
}

export default LogoutPage
