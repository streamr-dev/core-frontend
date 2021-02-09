// @flow

import { useDispatch } from 'react-redux'
import { post } from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import { logout as logoutAction } from '$shared/modules/user/actions'
import useFailure from '$shared/hooks/useFailure'
import routes from '$routes'

const LogoutPage = () => {
    const isMounted = useIsMounted()

    const fail = useFailure()

    const dispatch = useDispatch()

    useOnMount(async () => {
        try {
            await post({
                url: routes.auth.external.logout(),
            })
            if (isMounted()) {
                dispatch(logoutAction())
            }
        } catch (e) {
            fail(e)
        }
    })

    return null
}

export default LogoutPage
